import { API_URL } from './httpClient';

interface SpeakOptions {
  voiceId?: string; // Por ejemplo: 'Mia', 'Lupe', 'Andres', 'Lucia'
  rate?: number; // Para el sintetizador de fallback del navegador (default: 0.7)
  pitch?: number; // Para el sintetizador de fallback del navegador (default: 1.1)
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
}

// Caché en memoria para evitar llamadas redundantes a Amazon Polly
const audioCache = new Map<string, string>(); // clave: `${voiceId}:${text}` -> valor: data URI (base64)
let currentAudio: HTMLAudioElement | null = null;
let preferredBrowserVoice: SpeechSynthesisVoice | null = null;

/**
 * Inicializa y busca la mejor voz disponible en español en el navegador
 * (priorizando las voces locales/Google en caso de fallback).
 */
const initBrowserVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const updateVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const esVoices = voices.filter((v) => v.lang.startsWith('es'));
    preferredBrowserVoice =
      esVoices.find(
        (v) =>
          v.name.includes('Google') ||
          v.name.includes('Sabina') ||
          v.name.includes('Monica') ||
          v.name.includes('Paulina')
      ) ||
      esVoices[0] ||
      null;
  };

  updateVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoice;
  }
};

// Inicializamos al cargar el módulo
if (typeof window !== 'undefined') {
  initBrowserVoices();
}

/**
 * Detiene cualquier audio en reproducción (tanto de Polly como del sintetizador local).
 */
export const stopSpeech = (): void => {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // Ignorar errores al pausar
    }
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignorar errores al cancelar
    }
  }
};

/**
 * Sintetizador local del navegador (Web Speech API) usado como fallback seguro y offline.
 */
export const speakWithBrowser = (text: string, options?: SpeakOptions): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options?.onError?.(new Error('Web Speech API no disponible en este navegador'));
    return;
  }

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  if (preferredBrowserVoice) {
    utterance.voice = preferredBrowserVoice;
    utterance.lang = preferredBrowserVoice.lang;
  } else {
    utterance.lang = 'es-ES';
  }

  utterance.rate = options?.rate ?? 0.7;
  utterance.pitch = options?.pitch ?? 1.1;

  if (options?.onStart) utterance.onstart = () => options.onStart?.();
  if (options?.onEnd) utterance.onend = () => options.onEnd?.();
  if (options?.onError) utterance.onerror = (e) => options.onError?.(e);

  window.speechSynthesis.speak(utterance);
};

/**
 * Sintetiza y reproduce voz con Amazon Polly como proveedor principal.
 * Si Amazon Polly no está disponible (sin red, error de backend o timeout),
 * conmuta instantáneamente al sintetizador local del navegador (Google / Web Speech API).
 */
export const speakText = async (text: string, options?: SpeakOptions): Promise<void> => {
  const cleanText = text?.trim();
  if (!cleanText) return;

  stopSpeech();

  const voiceId = options?.voiceId || 'Lucia';
  const cacheKey = `${voiceId}:${cleanText}`;

  // 1. Revisar si ya está en caché local
  const cachedDataUri = audioCache.get(cacheKey);
  if (cachedDataUri) {
    try {
      await playAudioUri(cachedDataUri, options);
      return;
    } catch (cachePlayError) {
      console.warn('Error al reproducir audio desde caché, recurriendo a fallback:', cachePlayError);
    }
  }

  // 2. Intentar solicitar síntesis a Amazon Polly a través del backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout de red

    const response = await fetch(`${API_URL}/tts/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: cleanText,
        voiceId,
        engine: 'standard',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Servidor TTS respondió con status: ${response.status}`);
    }

    const data: { audioBase64: string; mimeType: string } = await response.json();
    if (!data.audioBase64) {
      throw new Error('Respuesta inválida de Amazon Polly');
    }

    const dataUri = `data:${data.mimeType || 'audio/mp3'};base64,${data.audioBase64}`;
    audioCache.set(cacheKey, dataUri);

    await playAudioUri(dataUri, options);
  } catch (error) {
    // 3. Fallback automático a la Web Speech API del navegador (Google / Nativa)
    console.warn('Amazon Polly no disponible, usando síntesis del navegador como fallback:', error);
    speakWithBrowser(cleanText, options);
  }
};

/**
 * Helper interno para reproducir un URI de audio
 */
const playAudioUri = (uri: string, options?: SpeakOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(uri);
    currentAudio = audio;

    audio.onplay = () => {
      options?.onStart?.();
    };

    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
      options?.onEnd?.();
      resolve();
    };

    audio.onerror = (e) => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
      reject(e);
    };

    audio.play().catch(reject);
  });
};

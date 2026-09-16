/**
 * Configuración centralizada de la URL base del Backend.
 * - En local: 'http://localhost:3000'
 * - En producción (AWS Amplify): variable de entorno 'VITE_API_URL'
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

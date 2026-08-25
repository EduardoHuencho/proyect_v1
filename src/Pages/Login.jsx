import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../assets/logo.png';
import Fondo from '../Components/Fondo';
import loginfante from '../assets/logniños.png';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      console.log('Sesión iniciada con usuario ID:', data.id);
      navigate('/accesotutor');
    } catch (err) {
      console.error('Error en login:', err);

      if (err.message === 'AUTH_ERROR') {
        setError(
          'El correo o la contraseña son incorrectos. Por favor, inténtalo de nuevo.'
        );
      } else {
        setError(
          'No se pudo conectar con el servidor. Verifica tu conexión a internet o inténtalo más tarde.'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fondo>
      <div className="min-h-screen flex flex-col justify-between w-full">
        <div className="flex justify-center pt-8 pb-2 shrink-0">
          <img src={logoImg} alt="Logo TEAYUDO" className="h-16 w-auto" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-6 py-6 max-w-5xl mx-auto w-full">
          <div className="flex-1 flex flex-col items-center justify-center md:items-end md:pr-4 py-2">
            <img
              src={loginfante}
              alt="Ilustración amigos"
              className="w-full max-w-xs md:max-w-sm drop-shadow-xl"
            />
            <p className="text-center md:text-right text-[#4A7A96] font-semibold mt-4 text-sm max-w-xs">
              ¡Bienvenido a TEAYUDO!
              <br />
              Tu herramienta de comunicación.
            </p>
          </div>

          <div className="tarjeta-auth">
            <h2 className="text-2xl font-extrabold text-[#005088] mb-1">
              Iniciar sesión
            </h2>
            <p className="text-sm text-[#4A7A96] font-medium mb-6">
              Ingresa tus credenciales para continuar
            </p>

            {error && (
              <div className="mensaje-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="login-email" className="sr-only">
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@correo.com"
                  className="input-teayudo"
                />
              </div>

              <div className="relative w-full flex flex-col">
                <label htmlFor="login-password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-teayudo pr-12"
                />
                <button
                  type="button"
                  disabled={loading}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-alternar-password"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-logear-teayudo"
              >
                {loading ? 'CONECTANDO...' : 'INGRESAR'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate('/registro')}
                className="link-registro"
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div>
          </div>
        </div>

        <div className="h-8 shrink-0 hidden md:block"></div>
      </div>
    </Fondo>
  );
}

export default Login;
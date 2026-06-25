import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../assets/logo.png';
import Fondo from '../Components/Fondo';
import loginfante from '../assets/logniños.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('Iniciando sesión con:', { email });
    navigate('/page1');
  }

  return (
    <Fondo>
      <div className="min-h-screen flex flex-col">
        <div className="flex justify-center pt-8 pb-2">
          <img src={logoImg} alt="Logo TEAYUDO" className="h-16 w-auto" />
        </div>

        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 px-6 pb-10 max-w-5xl mx-auto w-full">
          <div className="flex-1 flex flex-col items-center justify-center md:items-end md:pr-8 py-4">
            <img
              src={loginfante}
              alt="Ilustración amigos"
              className="w-full max-w-xs md:max-w-sm drop-shadow-xl"
            />
            <p className="text-center md:text-right text-[#4A7A96] font-semibold mt-3 text-sm max-w-xs">
              ¡Bienvenido a TEAYUDO!
              <br />
              Tu herramienta de comunicación.
            </p>
          </div>

          <div className="flex-1 w-full max-w-sm rounded-[30px] p-8 shadow-2xl bg-white">
            <h2 className="text-2xl font-extrabold text-[#005088] mb-1">
              Iniciar sesión
            </h2>
            <p className="text-sm text-[#4A7A96] font-medium mb-6">
              Ingresa tus credenciales para continuar
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
                className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[13px_18px] outline-none placeholder:text-[#003052]/50"
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[13px_45px_13px_18px] outline-none placeholder:text-[#003052]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A7A96] hover:text-[#005088] focus:outline-none select-none active:scale-90 transition-all"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <button
                type="submit"
                className="mt-3 w-full py-4 rounded-[18px] font-extrabold text-xl bg-[#FDD835] text-[#003052] border-3 border-[#C8A800] shadow-[0_6px_0_#C8A800] transition-all hover:scale-105 active:scale-95 active:translate-y-[2px] active:shadow-[0_4px_0_#C8A800]"
              >
                INGRESAR
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => navigate('/registro')}
                className="text-sm font-bold text-[#4A7A96] hover:text-[#005088] transition-colors focus:outline-none"
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fondo>
  );
}

export default Login;

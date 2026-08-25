import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../assets/logo.png';
import ninioImg from '../assets/logniños.png';
import Fondo from '../Components/Fondo';

const handlePinChange = (value, setFunction) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 4) {
    setFunction(cleaned);
  }
};

function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !email.trim() ||
      !password ||
      !pin
    ) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      alert('Los correos electrónicos no coinciden.');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (pin.length !== 4 || confirmPin.length !== 4) {
      alert('El PIN parental debe tener exactamente 4 dígitos.');
      return;
    }

    if (pin !== confirmPin) {
      alert('Los números de PIN ingresados no coinciden.');
      return;
    }

    const datosUsuario = {
      email: email.trim().toLowerCase(),
      password: password,
      firstName: nombre.trim(),
      lastName: apellido.trim(),
      administrativePin: pin,
    };

    try {
      const respuesta = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert('Cuenta creada con éxito.');
        navigate('/');
      } else {
        alert(
          `Error al registrarse: ${resultado.message || 'Inténtalo de nuevo.'}`
        );
      }
    } catch (error) {
      console.error('Error al conectar con Nest:', error);
      alert('No se pudo establecer conexión con el servidor.');
    }
  }

  return (
    <Fondo>
      <div className="min-h-screen flex flex-col justify-between w-full py-4 sm:py-8 landscape:py-4">
        <div className="flex justify-center pt-2 pb-2 shrink-0">
          <img src={logoImg} alt="Logo TEAYUDO" className="h-12 sm:h-16 w-auto" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 px-4 sm:px-6 py-2 max-w-5xl mx-auto w-full">
          <div className="flex-1 flex flex-col items-center justify-center md:items-end md:pr-6 py-2">
            <img
              src={ninioImg}
              alt="Ilustración amigos"
              className="w-full max-w-xs md:max-w-sm drop-shadow-xl"
            />
            <p className="text-center md:text-right text-[#4A7A96] font-semibold mt-3 text-sm max-w-xs">
              ¡Únete a TEAYUDO!
              <br />
              Crea una cuenta para empezar a comunicarte.
            </p>
          </div>

          <div className="tarjeta-auth max-w-md p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-[#005088] mb-1 text-center md:text-left">
              Crear cuenta
            </h2>
            <p className="text-sm text-[#4A7A96] font-medium mb-5 text-center md:text-left">
              Regístrate como tutor para gestionar la app
            </p>

            <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <label htmlFor="registro-nombre" className="sr-only">Nombre</label>
                <input
                  id="registro-nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                  className="input-teayudo"
                />
                <label htmlFor="registro-apellido" className="sr-only">Apellido</label>
                <input
                  id="registro-apellido"
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Apellido"
                  className="input-teayudo"
                />
              </div>

              <label htmlFor="registro-email" className="sr-only">Correo electrónico</label>
              <input
                id="registro-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
                className="input-teayudo"
              />

              <label htmlFor="registro-confirm-email" className="sr-only">Repetir correo electrónico</label>
              <input
                id="registro-confirm-email"
                type="email"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Repetir correo electrónico"
                className="input-teayudo"
              />

              <div className="relative w-full">
                <label htmlFor="registro-password" className="sr-only">Contraseña</label>
                <input
                  id="registro-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña (mínimo 6 caracteres)"
                  className="input-teayudo pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="btn-alternar-password"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <div className="relative w-full">
                <label htmlFor="registro-confirm-password" className="sr-only">Repetir contraseña</label>
                <input
                  id="registro-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetir contraseña"
                  className="input-teayudo pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="btn-alternar-password"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <div className="border-t border-dashed border-[#7A9AB8]/40 my-1 pt-2 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faLock}
                  className="text-[#005088] text-xs"
                />
                <p className="text-xs font-bold text-[#005088] tracking-wide">
                  CONFIGURACIÓN SEGURIDAD PARENTAL
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative w-full">
                  <label htmlFor="registro-pin" className="sr-only">PIN parental</label>
                  <input
                    id="registro-pin"
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    required
                    maxLength={4}
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value, setPin)}
                    placeholder="PIN (4 dígitos)"
                    className="input-teayudo text-center pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                    onClick={() => setShowPin(!showPin)}
                    className="btn-alternar-password right-3 text-sm"
                  >
                    <FontAwesomeIcon icon={showPin ? faEyeSlash : faEye} />
                  </button>
                </div>

                <div className="relative w-full">
                  <label htmlFor="registro-confirm-pin" className="sr-only">Repetir PIN parental</label>
                  <input
                    id="registro-confirm-pin"
                    type={showConfirmPin ? 'text' : 'password'}
                    inputMode="numeric"
                    required
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => handlePinChange(e.target.value, setConfirmPin)}
                    placeholder="Repetir PIN"
                    className="input-teayudo text-center pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="btn-alternar-password right-3 text-sm"
                  >
                    <FontAwesomeIcon icon={showConfirmPin ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-logear-teayudo mt-2 py-3.5"
              >
                REGISTRARSE
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="link-registro"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        </div>

        <div className="h-4 shrink-0 hidden md:block"></div>
      </div>
    </Fondo>
  );
}

export default Registro;
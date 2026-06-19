import { useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import logoImg from "../assets/logo.png";
import ninosImg from "../assets/niños1.png";

function Registro() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const navigate = useNavigate();

  const handlePinChange = (value, setFunction) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 4) {
      setFunction(cleaned);
    }
  };

  function handleRegister(e) {
    e.preventDefault();

    if (email !== confirmEmail) {
      alert("Los correos electrónicos no coinciden.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (pin.length < 4 || pin !== confirmPin) {
      alert("El PIN parental debe ser de 4 dígitos y coincidir.");
      return;
    }

    console.log("Registrando nuevo usuario:", { email, pin });
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-[#E0F7FA]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1.5px 1.5px, rgba(0,80,136,0.07) 1.5px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="flex justify-center pt-6 pb-2">
        <img src={logoImg} alt="Logo TEAYUDO" className="h-16 w-auto" />
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-6 pb-12 max-w-5xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-center justify-center md:items-end md:pr-8 py-4">
          <img
            src={ninosImg}
            alt="Ilustración amigos"
            className="w-full max-w-xs md:max-w-sm drop-shadow-xl"
          />
          <p className="text-center md:text-right text-[#4A7A96] font-semibold mt-3 text-sm max-w-xs">
            ¡Únete a TEAYUDO!
            <br />
            Crea una cuenta para empezar a comunicarte.
          </p>
        </div>

        <div className="flex-1 w-full max-w-md rounded-[30px] p-6 md:p-8 shadow-2xl bg-white max-h-[85vh] overflow-y-auto scrollbar-thin">
          <h2 className="text-2xl font-extrabold text-[#005088] mb-1">
            Crear cuenta
          </h2>
          <p className="text-sm text-[#4A7A96] font-medium mb-5">
            Regístrate como tutor para gestionar la app
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com"
              className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_16px] outline-none placeholder:text-[#003052]/50"
            />
            <input
              type="email"
              required
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Repetir correo electrónico"
              className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_16px] outline-none placeholder:text-[#003052]/50"
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña (mínimo 6 caracteres)"
                className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_45px_11px_16px] outline-none placeholder:text-[#003052]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A7A96] hover:text-[#005088] focus:outline-none select-none active:scale-90 transition-all"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir contraseña"
                className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_45px_11px_16px] outline-none placeholder:text-[#003052]/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A7A96] hover:text-[#005088] focus:outline-none select-none active:scale-90 transition-all"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
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
                <input
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  required
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value, setPin)}
                  placeholder="PIN (4 dígitos)"
                  className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_40px_11px_12px] outline-none text-center placeholder:text-[#003052]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#4A7A96] hover:text-[#005088] focus:outline-none select-none"
                >
                  <FontAwesomeIcon icon={showPin ? faEyeSlash : faEye} />
                </button>
              </div>

              <div className="relative w-full">
                <input
                  type={showConfirmPin ? "text" : "password"}
                  inputMode="numeric"
                  required
                  value={confirmPin}
                  onChange={(e) =>
                    handlePinChange(e.target.value, setConfirmPin)
                  }
                  placeholder="Repetir PIN"
                  className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_40px_11px_12px] outline-none text-center placeholder:text-[#003052]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#4A7A96] hover:text-[#005088] focus:outline-none select-none"
                >
                  <FontAwesomeIcon icon={showConfirmPin ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3.5 rounded-[18px] font-extrabold text-xl bg-[#FDD835] text-[#003052] border-3 border-[#C8A800] shadow-[0_6px_0_#C8A800] transition-all hover:scale-105 active:scale-95 active:translate-y-[2px] active:shadow-[0_4px_0_#C8A800]"
            >
              REGISTRARSE
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm font-bold text-[#4A7A96] hover:text-[#005088] transition-colors"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;

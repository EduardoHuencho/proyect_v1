import { useState } from "react";
import { useNavigate } from "react-router";
import logoImg from "../assets/logo.png";
import ninosImg from "../assets/niños1.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tutor");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Iniciando sesión como:", role);
    // Descomenta para navegar:
    // navigate(role === "tutor" ? "/dashboard" : "/pictogramas");
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
      <div className="flex justify-center pt-8 pb-2">
        <img src={logoImg} alt="Logo TEAYUDO" className="h-16 w-auto" />
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 px-6 pb-10 max-w-5xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-center justify-center md:items-end md:pr-8 py-4">
          <img
            src={ninosImg}
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
            ¿Quién eres hoy?
          </p>

          <div className="flex gap-2 p-1.5 rounded-2xl mb-6 bg-[#E0F7FA]">
            {["tutor", "infant"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  role === r
                    ? "bg-[#005088] text-white"
                    : "bg-transparent text-[#4A7A96]"
                }`}
              >
                <span>{r === "tutor" ? "👩‍🏫" : "🧒"}</span>
                <span>{r === "tutor" ? "Tutor/a" : "Niño/a"}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com"
              className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base偏 p-[13px_18px] outline-none placeholder:text-[#003052]/50"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[13px_18px] outline-none placeholder:text-[#003052]/50"
            />

            <button
              type="submit"
              className="mt-3 w-full py-4 rounded-[18px] font-extrabold text-xl bg-[#FDD835] text-[#003052] border-3 border-[#C8A800] shadow-[0_6px_0_#C8A800] transition-all hover:scale-105 active:scale-95 active:translate-y-[2px] active:shadow-[0_4px_0_#C8A800]"
            >
              INGRESAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

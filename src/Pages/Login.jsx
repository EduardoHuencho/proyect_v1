import { useState } from "react";
import { useNavigate } from "react-router";

// 1. Importa las imágenes correctamente como archivos estáticos
import logoImg from "../assets/logo.png";
import ninosImg from "../assets/niños1.png";

const P = { fontFamily: "'Poppins', sans-serif" };

const inputStyle = {
  fontFamily: "'Poppins', sans-serif",
  background: "#B0C8DC",
  border: "2.5px solid #7A9AB8",
  borderRadius: "14px",
  color: "#003052",
  fontSize: "1rem",
  padding: "13px 18px",
  outline: "none",
  width: "100%",
  fontWeight: 500,
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tutor");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Iniciando sesión como:", role);
    // navigate("/dashboard"); // Descomenta esto cuando tengas tu siguiente página
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#E0F7FA",
        backgroundImage:
          "radial-gradient(circle at 1.5px 1.5px, rgba(0,80,136,0.07) 1.5px, transparent 0)",
        backgroundSize: "22px 22px",
        ...P,
      }}
    >
      {/* 2. Logo usando etiqueta img */}
      <div className="flex justify-center pt-8 pb-2">
        <img src={logoImg} alt="Logo TEAYUDO" className="h-16 w-auto" />
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 px-6 pb-10 max-w-5xl mx-auto w-full">
        
        {/* 3. Ilustración usando etiqueta img */}
        <div className="flex-1 flex flex-col items-center justify-center md:items-end md:pr-8 py-4">
          <img 
            src={ninosImg} 
            alt="Ilustración amigos" 
            className="w-full max-w-xs md:max-w-sm drop-shadow-xl" 
          />
          <p className="text-center md:text-right text-[#4A7A96] font-semibold mt-3 text-sm max-w-xs">
            ¡Bienvenido a TEAYUDO!<br />
            Tu herramienta de comunicación.
          </p>
        </div>

        {/* Formulario */}
        <div
          className="flex-1 w-full max-w-sm rounded-[30px] p-8 shadow-2xl"
          style={{ background: "white" }}
        >
          <h2 className="text-2xl font-extrabold text-[#005088] mb-1">Iniciar sesión</h2>
          <p className="text-sm text-[#4A7A96] font-medium mb-6">¿Quién eres hoy?</p>

          <div className="flex gap-2 p-1.5 rounded-2xl mb-6" style={{ background: "#E0F7FA" }}>
            {["tutor", "infant"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: role === r ? "#005088" : "transparent",
                  color: role === r ? "white" : "#4A7A96",
                }}
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
              style={{ ...inputStyle }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle }}
            />
            <button
              type="submit"
              className="mt-3 w-full py-4 rounded-[18px] font-extrabold text-xl transition-all hover:scale-105 active:scale-95"
              style={{
                background: "#FDD835",
                color: "#003052",
                border: "3px solid #C8A800",
                boxShadow: "0 6px 0 #C8A800",
              }}
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
import fondoImg from '../assets/diseño.jpg'

function Fondo({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen font-sans"
      style={{
        backgroundImage: `url(${fondoImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  )
}

export default Fondo
interface CategoriaCardProps {
  label: string;
  color?: string;
  activo: boolean;
  onClick: () => void;
}

function CategoriaCard({
  label,
  color,
  activo,
  onClick,
}: CategoriaCardProps) {
  const isHex = color?.startsWith('#') || color?.startsWith('rgb');

  const dynamicStyles = isHex
    ? {
        backgroundColor: color,
        borderColor: `color-mix(in srgb, ${color} 70%, black)`,
        boxShadow: activo ? `0 4px 12px color-mix(in srgb, ${color} 50%, black)` : undefined,
      }
    : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      style={dynamicStyles}
      className={`flex items-center gap-2 px-4.5 py-2 rounded-full text-xs sm:text-sm font-black transition-all shrink-0 active:scale-95 cursor-pointer border ${
        activo
          ? 'scale-105 shadow-md text-neutral-900' 
          : 'border-black/15 shadow-xs text-neutral-850 hover:brightness-95 hover:shadow-sm'
      } ${!isHex ? (color || 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50') : ''}`}
    >
      <span className="truncate">{label}</span>
    </button>
  );
}

export default CategoriaCard;
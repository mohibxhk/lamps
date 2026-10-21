const RATIOS = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[16/9]",
  wide: "aspect-[21/9]",
  hero: "h-full",
};

export function ImageSlot({
  src,
  ratio = "portrait",
  alt = "",
  dark = false,
  eager = false,
  label,
  className = "",
  imgClassName = "",
}) {
  const ratioClass = RATIOS[ratio] || ratio;

  if (src) {
    return (
      <div className={`${ratioClass} overflow-hidden ${className}`} data-testid="image-slot">
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      data-testid="image-slot-placeholder"
      className={`${ratioClass} placeholder-crosshair placeholder-shimmer relative flex items-center justify-center border border-dashed ${
        dark ? "border-nightline bg-night" : "border-hairline bg-canvas"
      } ${className}`}
      role="img"
      aria-label={label || "You can upload your image here"}
    >
      <span
        className={`max-w-[70%] text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] sm:text-[11px] ${
          dark ? "text-[#8a8a82]" : "text-mute"
        }`}
      >
        {label || "You can upload your image here"}
      </span>
      <span
        className={`absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.2em] ${
          dark ? "text-[#5a5a54]" : "text-hairline"
        }`}
      >
        {ratio === "portrait" ? "3:4" : ratio === "landscape" ? "16:9" : ratio === "wide" ? "21:9" : ratio === "square" ? "1:1" : ""}
      </span>
    </div>
  );
}

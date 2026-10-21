import { useLanguage } from "../i18n/LanguageContext";

export function Marquee({ dark = false }) {
  const { t } = useLanguage();
  const items = [...t.marquee, ...t.marquee, ...t.marquee, ...t.marquee];
  return (
    <div
      data-testid="editorial-marquee"
      aria-hidden="true"
      className={`overflow-hidden border-y py-4 ${
        dark ? "border-nightline bg-night text-[#8a8a82]" : "border-line bg-paper text-mute"
      }`}
    >
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center font-mono text-[11px] uppercase tracking-[0.35em]">
            <span className="px-8">{item}</span>
            <span className={dark ? "text-nightline" : "text-hairline"}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

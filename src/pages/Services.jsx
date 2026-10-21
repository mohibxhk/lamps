import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { ImageSlot } from "../components/ImageSlot";
import { Reveal } from "../components/Reveal";
import { Overline } from "../components/shared";
import { ASSETS } from "../config/site";

export default function Services() {
  const { t } = useLanguage();
  return (
    <main data-testid="services-page" className="pt-24 lg:pt-28">
      <Seo title={t.meta.services.title} description={t.meta.services.desc} />
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <header className="border-b border-line pb-14 pt-10 lg:pt-16">
          <Reveal><Overline>{t.services.overline}</Overline></Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">{t.services.title}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-mute">{t.services.intro}</p>
          </Reveal>
        </header>

        <section className="py-16 lg:py-24">
          {t.services.items.map((s, i) => (
            <Reveal key={s.title} delay={0.05 * i}>
              <div className="grid gap-4 border-t border-line py-10 last:border-b lg:grid-cols-12 lg:items-baseline">
                <span className="font-mono text-[10px] tracking-[0.2em] text-mute lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-serif text-3xl font-light tracking-tight text-ink lg:col-span-5">{s.title}</h2>
                <p className="text-sm font-light leading-relaxed text-mute lg:col-span-5 lg:col-start-8">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <Reveal className="pb-20">
          <ImageSlot src={ASSETS.services.banner} ratio="wide" alt={t.services.title} />
        </Reveal>

        <div className="pb-24 text-center">
          <Link
            to="/contact?type=service"
            data-testid="services-cta"
            className="group relative inline-block overflow-hidden bg-night px-10 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper"
          >
            <span className="relative z-10">{t.services.cta}</span>
            <span className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}

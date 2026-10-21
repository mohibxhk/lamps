import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { ImageSlot } from "../components/ImageSlot";
import { Marquee } from "../components/Marquee";
import { Reveal } from "../components/Reveal";
import { Overline } from "../components/shared";
import { ASSETS } from "../config/site";

export default function About() {
  const { t } = useLanguage();
  return (
    <main data-testid="about-page" className="pt-24 lg:pt-28">
      <Seo title={t.meta.about.title} description={t.meta.about.desc} />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <header className="grid gap-12 border-b border-line pb-20 pt-10 lg:grid-cols-12 lg:pt-16">
          <div className="lg:col-span-7">
            <Reveal><Overline>{t.about.overline}</Overline></Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-5 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl lg:text-7xl">{t.about.title}</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-soot sm:text-xl">{t.about.lead}</p>
            </Reveal>
          </div>
          <Reveal delay={0.25} className="lg:col-span-4 lg:col-start-9 lg:mt-20">
            <ImageSlot src={ASSETS.about.portrait} ratio="portrait" alt="Gianni Gabutti" />
          </Reveal>
        </header>

        <section className="grid gap-12 py-20 lg:grid-cols-12 lg:py-32">
          <Reveal className="lg:col-span-5">
            <Overline>{t.about.approach_overline}</Overline>
            <h2 className="mt-5 font-serif text-3xl font-light tracking-tight text-ink sm:text-4xl">{t.about.approach_title}</h2>
            <p className="mt-6 text-base font-light leading-relaxed text-mute">{t.about.approach_body}</p>
          </Reveal>
          <div className="space-y-0 lg:col-span-6 lg:col-start-7">
            {t.about.values.map((v, i) => (
              <Reveal key={v.title} delay={0.08 * i}>
                <div className="flex gap-8 border-t border-line py-8 last:border-b">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-2xl font-light text-ink">{v.title}</h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-mute">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      <Reveal className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 lg:px-16">
        <ImageSlot src={ASSETS.about.landscape} ratio="wide" alt="Gianni Gabutti — atelier" />
      </Reveal>
      <Marquee />
    </main>
  );
}

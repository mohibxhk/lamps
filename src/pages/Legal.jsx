import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { Overline } from "../components/shared";

export default function Legal() {
  const { t } = useLanguage();
  const sections = [
    { id: "privacy", title: t.legal.privacy_title, body: t.legal.privacy_body },
    { id: "cookies", title: t.legal.cookies_title, body: t.legal.cookies_body },
    { id: "legal", title: t.legal.legal_title, body: t.legal.legal_body },
  ];
  return (
    <main data-testid="legal-page" className="pt-24 lg:pt-28">
      <Seo title={t.meta.legal.title} description={t.meta.legal.desc} />
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <header className="border-b border-line pb-14 pt-10 lg:pt-16">
          <Reveal><Overline>{t.legal.overline}</Overline></Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">{t.legal.title}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p data-testid="legal-draft-note" className="mt-8 border border-dashed border-hairline bg-canvas px-5 py-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-mute">
              {t.legal.draft_note}
            </p>
          </Reveal>
        </header>
        <div className="py-16 lg:py-20">
          {sections.map((s, i) => (
            <Reveal key={s.id} delay={0.05 * i}>
              <section id={s.id} className="border-t border-line py-12 first:border-t-0 first:pt-0">
                <h2 className="font-serif text-3xl font-light tracking-tight text-ink">{s.title}</h2>
                <p className="mt-5 text-base font-light leading-relaxed text-soot">{s.body}</p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}

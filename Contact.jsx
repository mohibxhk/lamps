import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { ImageSlot } from "../components/ImageSlot";
import { Reveal } from "../components/Reveal";
import { Overline } from "../components/shared";
import { EnquiryForm } from "../components/EnquiryForm";
import { SITE, ASSETS } from "../config/site";

export default function Contact() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const presetType = ["general", "product", "project", "service"].includes(params.get("type")) ? params.get("type") : "general";
  const presetRef = params.get("ref") || "";

  const rows = [
    [t.contact.address_label, SITE.contact.address || t.contact.address_value],
    [t.contact.phone_label, SITE.contact.phone || t.contact.phone_value],
    [t.contact.email_label, SITE.contact.email || t.contact.email_value],
    [t.contact.hours_label, SITE.contact.hours || t.contact.hours_value],
  ];

  return (
    <main data-testid="contact-page" className="pt-24 lg:pt-28">
      <Seo title={t.meta.contact.title} description={t.meta.contact.desc} />
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <header className="border-b border-line pb-14 pt-10 lg:pt-16">
          <Reveal><Overline>{t.contact.overline}</Overline></Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">{t.contact.title}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-mute">{t.contact.intro}</p>
          </Reveal>
        </header>

        <div className="grid gap-16 py-16 lg:grid-cols-12 lg:py-24">
          <Reveal className="lg:col-span-5">
            <Overline>{t.contact.info_title}</Overline>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {rows.map(([k, v]) => (
                <div key={k} className="py-5">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-mute">{k}</dt>
                  <dd className="mt-1.5 text-sm font-light leading-relaxed text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-hairline">{t.contact.config_note}</p>
            <div className="mt-10">
              <ImageSlot src={ASSETS.contact.map} ratio="landscape" alt="Map" label={t.contact.map_placeholder} />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
            <h2 className="font-serif text-3xl font-light tracking-tight text-ink">{t.contact.form.title}</h2>
            <div className="mt-10">
              <EnquiryForm key={`${presetType}-${presetRef}-${t.contact.form.title}`} presetType={presetType} presetReference={presetRef} />
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

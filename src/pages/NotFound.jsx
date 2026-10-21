import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main data-testid="not-found-page" className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <Seo title={t.common.not_found} description={t.common.not_found_text} />
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">404</p>
      <h1 className="mt-4 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">{t.common.not_found}</h1>
      <p className="mt-4 max-w-sm text-sm font-light text-mute">{t.common.not_found_text}</p>
      <Link to="/" data-testid="not-found-home-link" className="mt-10 border-b border-ink pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">
        {t.common.back_home}
      </Link>
    </main>
  );
}

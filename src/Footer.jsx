import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { SITE, ASSETS } from "../config/site";
import { LangSwitch } from "./Header";

export function Footer() {
  const { t } = useLanguage();
  const links = [
    { to: "/products", label: t.nav.products },
    { to: "/projects", label: t.nav.projects },
    { to: "/about", label: t.nav.about },
    { to: "/services", label: t.nav.services },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <footer data-testid="site-footer" className="border-t border-nightline bg-night text-paper">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <img src={ASSETS.logo.dark} alt={SITE.name} data-testid="footer-logo" className="h-14 w-auto sm:h-16" />
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.4em] text-[#6a6a62]">{SITE.subline}</p>
            <p className="mt-8 max-w-sm font-sans text-sm font-light leading-relaxed text-[#a3a39a]">
              {t.footer.tagline}
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6a6a62]">{t.footer.navigate}</p>
            <ul className="mt-5 space-y-3">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm font-light text-[#a3a39a] transition-colors hover:text-paper" data-testid={`footer-link-${l.to.slice(1)}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6a6a62]">{t.footer.contact}</p>
            <ul className="mt-5 space-y-3 text-sm font-light text-[#a3a39a]">
              <li>{SITE.contact.address || t.contact.address_value}</li>
              <li>{SITE.contact.email || t.contact.email_value}</li>
              <li>{SITE.contact.phone || t.contact.phone_value}</li>
            </ul>
            <div className="mt-8">
              <LangSwitch dark testidPrefix="footer-lang" />
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-nightline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6a6a62]">
            © {new Date().getFullYear()} {SITE.name} — {t.footer.rights}
          </p>
          <Link to="/legal" data-testid="footer-link-legal" className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6a6a62] transition-colors hover:text-paper">
            {t.footer.legal}
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { SITE } from "../config/site";
import { EASE } from "./Reveal";

const LINKS = [
  { to: "/", key: "home" },
  { to: "/products", key: "products" },
  { to: "/projects", key: "projects" },
  { to: "/about", key: "about" },
  { to: "/services", key: "services" },
  { to: "/contact", key: "contact" },
];

export function LangSwitch({ dark = false, testidPrefix = "lang" }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]" data-testid={`${testidPrefix}-switcher`}>
      {["it", "en"].map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className={dark ? "text-nightline" : "text-hairline"}>/</span>}
          <button
            data-testid={`${testidPrefix}-switch-${l}`}
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`transition-colors duration-300 ${
              lang === l
                ? dark ? "text-paper" : "text-ink"
                : dark ? "text-[#6a6a62] hover:text-paper" : "text-mute hover:text-ink"
            }`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    `relative font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${
      isActive ? "text-ink" : "text-mute hover:text-ink"
    } after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-ink after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <>
      <header
        data-testid="site-header"
        className="fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <Link to="/" data-testid="brand-wordmark" className="flex items-center" aria-label="Gianni Gabutti — Home">
            <img
              src="/logo-light.png"
              alt={SITE.name}
              data-testid="brand-logo"
              className="h-10 w-auto transition-opacity duration-300 hover:opacity-80 sm:h-12"
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink key={l.key} to={l.to} end={l.to === "/"} className={linkClass} data-testid={`nav-link-${l.key}`}>
                {t.nav[l.key]}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <LangSwitch />
          </div>

          <button
            data-testid="mobile-menu-open"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-ink lg:hidden"
            aria-label={t.nav.menu}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]">{t.nav.menu}</span>
            <Menu size={18} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            className="fixed inset-0 z-50 flex flex-col bg-night text-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <img src="/logo-light.png" alt={SITE.name} className="h-9 w-auto" />
              <button data-testid="mobile-menu-close" onClick={() => setOpen(false)} aria-label={t.nav.close} className="text-paper">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-6" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.6, ease: EASE }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    onClick={() => setOpen(false)}
                    data-testid={`mobile-nav-link-${l.key}`}
                    className={`block py-2 font-serif text-4xl font-light tracking-wide transition-colors sm:text-5xl ${
                      location.pathname === l.to ? "text-paper" : "text-[#8a8a82] hover:text-paper"
                    }`}
                  >
                    {t.nav[l.key]}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="flex items-center justify-between border-t border-nightline px-6 py-6">
              <LangSwitch dark testidPrefix="mobile-lang" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6a6a62]">{SITE.subline}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

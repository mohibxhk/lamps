import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { Overline, ProjectCard } from "../components/shared";
import { fetchProjects } from "../lib/api";

const CATEGORIES = ["all", "residential", "hospitality", "retail", "commercial", "outdoor"];

export default function Projects() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const category = params.get("cat") || "all";
  const [items, setItems] = useState(null);

  useEffect(() => {
    setItems(null);
    fetchProjects(category === "all" ? {} : { category })
      .then(setItems)
      .catch(() => setItems([]));
  }, [category]);

  return (
    <main data-testid="projects-page" className="pt-24 lg:pt-28">
      <Seo title={t.meta.projects.title} description={t.meta.projects.desc} />
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <header className="border-b border-line pb-14 pt-10 lg:pt-16">
          <Reveal><Overline>{t.projects_page.overline}</Overline></Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">{t.projects_page.title}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-mute">{t.projects_page.intro}</p>
          </Reveal>
        </header>

        <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-line py-6" role="tablist" aria-label={t.projects_page.overline}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              data-testid={`project-filter-${c}`}
              onClick={() => setParams(c === "all" ? {} : { cat: c })}
              className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                category === c ? "border-b border-ink pb-1 text-ink" : "pb-1 text-mute hover:text-ink"
              }`}
            >
              {t.projects_page.categories[c]}
            </button>
          ))}
        </div>

        <section className="space-y-24 py-16 lg:py-24">
          {items === null ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute" data-testid="projects-loading">{t.common.loading}</p>
          ) : items.length === 0 ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute" data-testid="projects-empty">{t.common.no_results}</p>
          ) : (
            items.map((p, i) => (
              <Reveal key={p.slug}>
                <ProjectCard project={p} flip={i % 2 === 1} />
              </Reveal>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

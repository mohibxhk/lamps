import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { ImageSlot } from "../components/ImageSlot";
import { Reveal } from "../components/Reveal";
import { Overline, ProjectCard, DemoBadge } from "../components/shared";
import { projectImage } from "../config/site";
import { fetchProject, fetchProjects, fetchProducts } from "../lib/api";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, pick } = useLanguage();
  const [project, setProject] = useState(null);
  const [used, setUsed] = useState([]);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProject(null); setNotFound(false);
    fetchProject(slug)
      .then((p) => {
        setProject(p);
        fetchProducts().then((all) => setUsed(all.filter((x) => p.products_used.includes(x.slug)))).catch(() => {});
        fetchProjects().then((all) => setRelated(all.filter((x) => x.slug !== slug).slice(0, 2))).catch(() => {});
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center pt-24" data-testid="project-not-found">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{t.common.not_found}</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center pt-24" data-testid="project-loading">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{t.common.loading}</p>
      </main>
    );
  }

  const images = projectImage(slug);
  const meta = [
    project.location && [t.project.location, project.location],
    project.year && [t.project.year, project.year],
    project.designer && [t.project.designer, project.designer],
  ].filter(Boolean);

  return (
    <main data-testid="project-detail-page" className="pt-24 lg:pt-28">
      <Seo title={`${project.title} — Gianni Gabutti`} description={pick(project.summary) || t.meta.projects.desc} />
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <nav className="pt-8" aria-label="breadcrumb">
          <Link to="/projects" data-testid="project-back-link" className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute transition-colors hover:text-ink">
            ← {t.nav.projects}
          </Link>
        </nav>

        <header className="py-12 lg:py-16">
          <Reveal><Overline>{t.projects_page.categories[project.category] || project.category}</Overline></Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">{project.title}</h1>
          </Reveal>
          {meta.length > 0 && (
            <Reveal delay={0.2}>
              <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
                {meta.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-mute">{k}</dt>
                    <dd className="mt-1 text-sm font-light text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </header>

        <Reveal>
          <div className="relative">
            <ImageSlot src={images.cover} ratio="landscape" alt={project.title} eager />
            {project.demo && <div className="absolute left-3 top-3"><DemoBadge /></div>}
          </div>
        </Reveal>

        <div className="grid gap-14 py-16 lg:grid-cols-12 lg:py-24">
          <Reveal className="lg:col-span-5">
            <Overline>{t.project.concept}</Overline>
            <p className="mt-6 text-base font-light leading-relaxed text-soot sm:text-lg">{pick(project.concept)}</p>
            <p className="mt-6 text-sm font-light leading-relaxed text-mute">{pick(project.description)}</p>
            <Link
              to={`/contact?type=project&ref=${project.slug}`}
              data-testid="project-enquire-button"
              className="mt-10 inline-block border-b border-ink pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ink"
            >
              {t.project.enquire}
            </Link>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {(images.gallery || []).map((src, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <ImageSlot src={src} ratio="landscape" alt={`${project.title} ${i + 1}`} />
              </Reveal>
            ))}
          </div>
        </div>

        {used.length > 0 && (
          <section className="border-t border-line py-16" data-testid="project-products-used">
            <Overline>{t.project.products_used}</Overline>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {used.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/products/${p.slug}`}
                    data-testid={`project-used-product-${p.slug}`}
                    className="group flex items-baseline justify-between py-5"
                  >
                    <span className="font-serif text-2xl font-light text-ink transition-transform duration-300 group-hover:translate-x-2">{p.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                      {p.categories.map((c) => t.products_page.categories[c] || c).join(" · ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="space-y-20 border-t border-line py-16 lg:py-24" data-testid="project-related">
            <Overline>{t.project.related}</Overline>
            {related.map((p, i) => <ProjectCard key={p.slug} project={p} flip={i % 2 === 1} />)}
          </section>
        )}
      </div>
    </main>
  );
}

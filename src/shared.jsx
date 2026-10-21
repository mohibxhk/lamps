import { Link } from "react-router-dom";
import { ImageSlot } from "./ImageSlot";
import { productImage, projectImage } from "../config/site";
import { useLanguage } from "../i18n/LanguageContext";

export function Overline({ children, dark = false }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${dark ? "text-[#8a8a82]" : "text-mute"}`}>
      {children}
    </p>
  );
}

export function DemoBadge() {
  const { t } = useLanguage();
  return (
    <span data-testid="demo-badge" className="inline-block border border-hairline bg-paper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
      {t.common.demo_badge}
    </span>
  );
}

export function ProductCard({ product, ratio = "portrait", eager = false }) {
  const { t, pick } = useLanguage();
  return (
    <Link
      to={`/products/${product.slug}`}
      data-testid={`product-card-${product.slug}`}
      className="group block"
    >
      <div className="relative">
        <ImageSlot
          src={productImage(product.slug).main}
          ratio={ratio}
          alt={product.name}
          eager={eager}
          className="transition-colors duration-500 group-hover:border-mute"
        />
        {product.demo && <div className="absolute left-3 top-3"><DemoBadge /></div>}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl text-ink transition-colors sm:text-2xl">{product.name}</h3>
        <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
          {product.categories.map((c) => t.products_page.categories[c] || c).join(" · ")}
        </p>
      </div>
      <p className="mt-1 text-sm font-light text-mute">{pick(product.tagline)}</p>
    </Link>
  );
}

export function ProjectCard({ project, flip = false }) {
  const { t, pick } = useLanguage();
  return (
    <Link
      to={`/projects/${project.slug}`}
      data-testid={`project-card-${project.slug}`}
      className={`group grid items-center gap-8 lg:grid-cols-12`}
    >
      <div className={`relative lg:col-span-8 ${flip ? "lg:order-2" : ""}`}>
        <ImageSlot
          src={projectImage(project.slug).cover}
          ratio="landscape"
          alt={project.title}
          className="transition-colors duration-500 group-hover:border-mute"
        />
        {project.demo && <div className="absolute left-3 top-3"><DemoBadge /></div>}
      </div>
      <div className={`lg:col-span-4 ${flip ? "lg:order-1 lg:text-right" : ""}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
          {t.projects_page.categories[project.category] || project.category}
          {project.location ? ` — ${project.location}` : ""}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <h3 className="mt-3 font-serif text-3xl font-light text-ink sm:text-4xl">{project.title}</h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-mute">{pick(project.summary)}</p>
        <span className="mt-5 inline-block border-b border-ink pb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ink">
          {t.common.discover}
        </span>
      </div>
    </Link>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { Overline, ProductCard } from "../components/shared";
import { fetchProducts } from "../lib/api";

const CATEGORIES = ["all", "indoor", "outdoor", "pendant", "wall", "ceiling", "floor", "table", "architectural", "decorative"];

export default function Products() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const category = params.get("cat") || "all";
  const [q, setQ] = useState("");
  const [items, setItems] = useState(null);

  useEffect(() => {
    setItems(null);
    fetchProducts(category === "all" ? {} : { category })
      .then(setItems)
      .catch(() => setItems([]));
  }, [category]);

  const visible = (items || []).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <main data-testid="products-page" className="pt-24 lg:pt-28">
      <Seo title={t.meta.products.title} description={t.meta.products.desc} />
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <header className="border-b border-line pb-14 pt-10 lg:pt-16">
          <Reveal><Overline>{t.products_page.overline}</Overline></Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">{t.products_page.title}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-mute">{t.products_page.intro}</p>
          </Reveal>
        </header>

        <div className="flex flex-col gap-6 border-b border-line py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3" role="tablist" aria-label={t.products_page.overline}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                data-testid={`filter-${c}`}
                onClick={() => setParams(c === "all" ? {} : { cat: c })}
                className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                  category === c ? "border-b border-ink pb-1 text-ink" : "pb-1 text-mute hover:text-ink"
                }`}
              >
                {t.products_page.categories[c]}
              </button>
            ))}
          </div>
          <input
            data-testid="product-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.common.search_placeholder}
            className="w-full border border-line bg-transparent px-4 py-2.5 text-sm font-light text-ink placeholder:text-mute/70 focus:border-ink focus:outline-none lg:w-64"
          />
        </div>

        <section className="py-16 lg:py-24">
          {items === null ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute" data-testid="products-loading">{t.common.loading}</p>
          ) : visible.length === 0 ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute" data-testid="products-empty">{t.common.no_results}</p>
          ) : (
            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, i) => (
                <Reveal key={p.slug} delay={0.05 * (i % 3)} className={i % 3 === 1 ? "lg:mt-20" : ""}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

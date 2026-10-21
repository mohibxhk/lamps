import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { ImageSlot } from "../components/ImageSlot";
import { Reveal } from "../components/Reveal";
import { Overline, ProductCard, DemoBadge } from "../components/shared";
import { productImage } from "../config/site";
import { fetchProduct, fetchProducts } from "../lib/api";

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, pick } = useLanguage();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setProduct(null); setNotFound(false); setActive(0);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        fetchProducts().then((all) =>
          setRelated(all.filter((x) => x.slug !== slug && x.categories.some((c) => p.categories.includes(c))).slice(0, 3))
        ).catch(() => {});
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center pt-24" data-testid="product-not-found">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{t.common.not_found}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center pt-24" data-testid="product-loading">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{t.common.loading}</p>
      </main>
    );
  }

  const images = productImage(slug);
  const gallery = [images.main, ...(images.gallery || [])];

  return (
    <main data-testid="product-detail-page" className="pt-24 lg:pt-28">
      <Seo title={`${product.name} — Gianni Gabutti`} description={pick(product.tagline) || t.meta.products.desc} />
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <nav className="pt-8" aria-label="breadcrumb">
          <Link to="/products" data-testid="product-back-link" className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute transition-colors hover:text-ink">
            ← {t.nav.products}
          </Link>
        </nav>

        <div className="grid gap-14 py-12 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="relative">
                <ImageSlot src={gallery[active]} ratio="portrait" alt={product.name} eager />
                {product.demo && <div className="absolute left-3 top-3"><DemoBadge /></div>}
              </div>
            </Reveal>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  data-testid={`product-gallery-thumb-${i}`}
                  onClick={() => setActive(i)}
                  aria-label={`${t.product.gallery} ${i + 1}`}
                  className={`transition-opacity ${active === i ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-paper" : "opacity-60 hover:opacity-100"}`}
                >
                  <ImageSlot src={src} ratio="square" alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
                {product.categories.map((c) => t.products_page.categories[c] || c).join(" · ")}
              </p>
              <h1 className="mt-4 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">{product.name}</h1>
              <p className="mt-4 text-lg font-light text-mute">{pick(product.tagline)}</p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 space-y-10">
              {pick(product.description) && (
                <section>
                  <Overline>{t.product.description}</Overline>
                  <p className="mt-4 text-base font-light leading-relaxed text-soot">{pick(product.description)}</p>
                </section>
              )}

              {product.materials.length > 0 && (
                <section>
                  <Overline>{t.product.materials}</Overline>
                  <ul className="mt-4 space-y-2">
                    {product.materials.map((m, i) => (
                      <li key={i} className="text-sm font-light text-soot">{pick(m)}</li>
                    ))}
                  </ul>
                </section>
              )}

              {product.finishes.length > 0 && (
                <section>
                  <Overline>{t.product.finishes}</Overline>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.finishes.map((f) => (
                      <span key={f} className="border border-line px-3 py-1.5 text-xs font-light text-soot">{f}</span>
                    ))}
                  </div>
                </section>
              )}

              {product.specs.length > 0 && (
                <section>
                  <Overline>{t.product.specs}</Overline>
                  <dl className="mt-4 divide-y divide-line border-y border-line">
                    {product.specs.map((s) => (
                      <div key={s.key} className="flex justify-between py-3">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                          {t.product.spec_keys[s.key] || s.key}
                        </dt>
                        <dd className="text-sm font-light text-ink">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <section>
                <Overline>{t.product.docs}</Overline>
                <p className="mt-4 text-sm font-light italic text-mute">{t.product.docs_note}</p>
              </section>

              <Link
                to={`/contact?type=product&ref=${product.slug}`}
                data-testid="product-enquire-button"
                className="group relative block overflow-hidden bg-night px-10 py-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-paper"
              >
                <span className="relative z-10">{t.product.enquire}</span>
                <span className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-line py-16 lg:py-24" data-testid="product-related">
            <Overline>{t.product.related}</Overline>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

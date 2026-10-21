import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { Seo } from "../components/Seo";
import { ImageSlot } from "../components/ImageSlot";
import { Marquee } from "../components/Marquee";
import { Reveal, MaskedLine } from "../components/Reveal";
import { Overline, ProductCard, ProjectCard } from "../components/shared";
import { ASSETS } from "../config/site";
import { fetchProducts, fetchProjects } from "../lib/api";

function Hero() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} data-testid="hero-section" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night">
      <div className="absolute inset-0">
        {ASSETS.hero.video ? (
          <video
            data-testid="hero-video"
            className="h-full w-full object-cover"
            src={ASSETS.hero.video}
            poster={ASSETS.hero.poster || undefined}
            autoPlay muted loop playsInline preload="metadata"
          />
        ) : ASSETS.hero.image ? (
          <motion.img
            data-testid="hero-image"
            src={ASSETS.hero.image}
            alt="Gianni Gabutti lighting — interior"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full object-cover object-[50%_35%]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-night">
            <div className="placeholder-crosshair flex h-[70%] w-[86%] items-center justify-center border border-dashed border-nightline">
              <span className="max-w-[70%] text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.25em] text-[#6a6a62]">
                You can upload your video here
              </span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-night/40" aria-hidden="true" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}
          className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-[#a3a39a]"
          data-testid="hero-overline"
        >
          {t.common.overline_location}
        </motion.p>
        <h1 className="font-serif text-5xl font-light leading-[1.04] tracking-tight text-paper sm:text-6xl lg:text-8xl">
          <MaskedLine delay={0.35}>{t.hero.line1}</MaskedLine>
          <MaskedLine delay={0.5}>{t.hero.line2}</MaskedLine>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }}
          className="mt-8 max-w-md text-base font-light leading-relaxed text-[#c5c5bc]"
        >
          {t.hero.sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <Link
            to="/products"
            data-testid="hero-cta-products"
            className="group relative overflow-hidden border border-paper/60 px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-paper transition-colors duration-500 hover:border-paper"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-ink">{t.hero.cta_products}</span>
            <span className="absolute inset-0 -translate-x-full bg-paper transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            data-testid="hero-cta-contact"
            className="border-b border-paper/40 pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c5c5bc] transition-colors hover:border-paper hover:text-paper"
          >
            {t.hero.cta_contact}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 sm:flex lg:right-16"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8a82]">{t.common.scroll}</span>
        <ArrowDown size={14} className="animate-bounce text-[#8a8a82]" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}

export default function Home() {
  const { t, lang } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [projects, setProjects] = useState([]);
  const philRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: philRef, offset: ["start end", "end start"] });
  const philY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  useEffect(() => {
    fetchProducts().then((d) => setFeatured(d.filter((p) => p.featured).slice(0, 4))).catch(() => {});
    fetchProjects().then((d) => setProjects(d.filter((p) => p.featured).slice(0, 2))).catch(() => {});
  }, []);

  return (
    <main data-testid="home-page">
      <Seo title={t.meta.home.title} description={t.meta.home.desc} />
      <Hero />
      <Marquee />

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-36" data-testid="home-intro">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><Overline>{t.home.intro_overline}</Overline></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight text-ink sm:text-5xl">
                {t.home.intro_title}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-soot sm:text-lg">
                {t.home.intro_body}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Link to="/about" data-testid="home-intro-link" className="mt-8 inline-block border-b border-ink pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">
                {t.home.intro_link}
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9 lg:mt-24">
            <ImageSlot src={ASSETS.home.introPortrait} ratio="portrait" alt="Gianni Gabutti" />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-stone" data-testid="home-products">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <Overline>{t.home.products_overline}</Overline>
              <h2 className="mt-4 font-serif text-3xl font-light tracking-tight text-ink sm:text-4xl">{t.home.products_title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/products" data-testid="home-products-link" className="border-b border-ink pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">
                {t.home.products_link}
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={0.08 * i} className={i % 2 === 1 ? "lg:mt-16" : ""}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section ref={philRef} className="bg-night text-paper" data-testid="home-philosophy">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Overline dark>{t.home.phil_overline}</Overline>
              <h2 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl">
                {t.home.phil_title}
              </h2>
              <p className="mt-8 max-w-md text-base font-light leading-relaxed text-[#a3a39a]">
                {t.home.phil_body}
              </p>
            </Reveal>
            <motion.div style={{ y: philY }} className="lg:col-span-6 lg:col-start-7">
              <ImageSlot src={ASSETS.home.philosophyLandscape} ratio="landscape" dark alt="Architectural light" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32" data-testid="home-projects">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Overline>{t.home.projects_overline}</Overline>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-tight text-ink sm:text-4xl">{t.home.projects_title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/projects" data-testid="home-projects-link" className="border-b border-ink pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">
              {t.home.projects_link}
            </Link>
          </Reveal>
        </div>
        <div className="mt-16 space-y-20">
          {projects.map((p, i) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} flip={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee dark />

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-36" data-testid="home-cta">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Overline>{t.home.cta_overline}</Overline>
          <h2 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {t.home.cta_title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-mute">{t.home.cta_body}</p>
          <Link
            to="/contact"
            data-testid="home-cta-button"
            className="group relative mt-10 inline-block overflow-hidden bg-night px-10 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper"
          >
            <span className="relative z-10">{t.home.cta_button}</span>
            <span className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}

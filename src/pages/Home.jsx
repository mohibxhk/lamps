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
        <video
          data-testid="hero-video"
          className="h-full w-full object-cover"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
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
          <div className="mt-1

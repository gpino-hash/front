"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomeHero } from "@/components/features/home/HomeHero";
import { Container } from "@/components/layout/container";
import { categories } from "@/lib/mock-data/categories";

/* ═══════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════ */

const featuredProviders = [
  {
    name: "Roberto Gómez",
    specialty: "Electricista matriculado",
    category: "Electricidad",
    distance: "5km",
    rating: 4.9,
    reviews: 128,
    price: "$25.000",
    badge: "Top Pro",
    verified: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbeuljT8HzshCJf2w3AH-fp6XAOLNaiHPNbY6Cq1U99AC5wh0UTyQJYY8Wt7A5jOD1bvE1DkuRPZhaKqKRG1htNIhWcJloM8yvdQhwgPldx4Fi06NJX9XkdiTADi-l9M6RGtvXNfahdQNqNS7M567suLq8BdI17HixlC7B9wsYfupoNb-YSaDycK3bTTJvY6HDGJ_puuRL0iqo56Ty1wQgQ5wqyPpxt_SOnMeBxLOqh8OhlgGf1Jp-81yQK2i_-UOlKl5I5eoLmA",
  },
  {
    name: "Lucía Mendez",
    specialty: "Limpieza profunda de hogares",
    category: "Limpieza",
    distance: "2km",
    rating: 4.7,
    reviews: 86,
    price: "$18.500",
    badge: null,
    verified: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0X3qeAdn1KERusMfl96dlha6NbWcP5_83f8JS0VIHAZj9B2wBjJeKU3covbevLVD097L3flFg8Lob7ckF7DyjnE33Op-W507ONPNiyAsmDkFkj-991abhAWcYg5iD4yVo3qfXOC27iBjX_HKO5bnjCv9BbLQP2egCzXRq4o1_5ksbKGRy53Xln_0UCVyOUcWeGPBKVYQV3nMOsxfHImnyN-Gj1n11oJI5EkjhOdXHbhLQQN46v0vShPyE84uu71IKwIHgJpjbmA",
  },
  {
    name: "Marcos Ruiz",
    specialty: "Plomería y Gasista",
    category: "Plomería",
    distance: "8km",
    rating: 4.8,
    reviews: 210,
    price: "$22.000",
    badge: null,
    verified: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi5JxvMPsBMwnEPaUXEUjBK2jAFmXUeu7reTRFRDnkolFFYHFA3XUWc5qCWbv1p7Xos7yj6p7PAoqt3yOFhkyL2_mqqIFJKMcrXHTfrH8AdigJ4AVogiFX51QFzIv7dmqBz3E2D_DQbQK0UsT0ZLEObaRKHoO9r3Rk7XcwQNFFefU3w5bymjVUSp9GAQnYRoNXKtKv30DqQd4IPP0rqGhcxlygX0pk9KDTMuw_EMz-bZg1ZgbP7xDynVF_LA4OnxU-OcDHfW9fng",
  },
  {
    name: "Carlos Villa",
    specialty: "Pintura de obra y decorativa",
    category: "Pintura",
    distance: "3km",
    rating: 5.0,
    reviews: 42,
    price: "$30.000",
    badge: "Nuevo",
    verified: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjcKy2TxSuovQv9Ko6OqGiR1c2NGG6vUhnq_pKCzUxTLB0SLaDCnllz7Wyzb_jk3mknG-rLJclaqD9mYmS0L6KoPTiuAY1qxrrcu8lTPj3nckQX0FJnp_JmNgTz5d1m_9bBUhmKN8OuFlEUHeVyUDVj_L3bGRHc-6w21hZwjUnEe84uahc_C84bru030432Y6Xs0ol6Gj5n0DnKeB7oj9Kk91Z3WfdPKyVZyrMaoncyjT1MQm7hnxK7SFxZVh1KbjupaDrJCt9rw",
  },
  {
    name: "Elena Ortiz",
    specialty: "Paisajismo y mantenimiento",
    category: "Jardinería",
    distance: "6km",
    rating: 4.6,
    reviews: 55,
    price: "$15.000",
    badge: null,
    verified: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFc0d5YS6A63eKjSRQ48gOMR7EvS3uJm4phEl1TgWLurW24ed_qezzJ4zABBHc6E-6lDN6mANe9UtDiJf19VM5ZLgL2hQ6GC7pm7H5ACrmgH58SWZoKWHqy8RAAcFvlwmlvtMHDZtmVxzA3VjJFhxkcAJkFhOeAE9v8iJtYBf1a9au85gFTu6hEjitZzlP8RicgK-wtzHvWY2Q7ikCX-PJ6yHPGR7UICMm-W8bAVXz_Bb8SPPjxMM651P6rYr8d3mwkpsigNEDYw",
  },
  {
    name: "Javier Sosa",
    specialty: "Carpintería de diseño",
    category: "Carpintería",
    distance: "4km",
    rating: 4.9,
    reviews: 94,
    price: "$45.000",
    badge: null,
    verified: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMILcXAGkUwM0tjtcVnz_Z9h5bHDYzIGb37BtzV8O8_ilvp_WoUvihkKD2zJMxljNfkx2Eg2j84jtt7Y3Zln7ompYOdRor3aKYwLWv7SeDWHwUNMcMCsYyjWHzIT4PQaVoCcDa8SOzQWZ1O3zw3pUJ8RmGttc1OQrak5rQhw4Xk515PecdUXUVHmWB8ywdUk3i7nRj-zAZAH41lYiCFJT4rHzfFADxA7OwOmSJtNfx1vWR_h-qa8GEPWshVMGPoE_Udpcv2X09kA",
  },
];

const howItWorks = [
  {
    step: 1,
    icon: "search",
    title: "Buscá lo que necesitás",
    description: "Escribí el servicio y tu ubicación. Te mostramos profesionales verificados cerca tuyo.",
  },
  {
    step: 2,
    icon: "compare_arrows",
    title: "Compará y elegí",
    description: "Revisá perfiles, reseñas, precios y disponibilidad. Elegí al profesional que más te convenza.",
  },
  {
    step: 3,
    icon: "calendar_month",
    title: "Reservá al instante",
    description: "Seleccioná fecha, hora y confirmá. El profesional recibe la solicitud y te responde en minutos.",
  },
  {
    step: 4,
    icon: "verified",
    title: "Servicio garantizado",
    description: "Calificá al profesional al terminar. Tu feedback ayuda a toda la comunidad.",
  },
];

const testimonials = [
  {
    name: "Valentina R.",
    location: "Palermo, CABA",
    rating: 5,
    text: "Necesitaba un electricista urgente un domingo. En 20 minutos ya tenía a Roberto confirmado. Excelente servicio y super profesional.",
    service: "Electricidad",
    avatar: "VR",
  },
  {
    name: "Martín L.",
    location: "Belgrano, CABA",
    rating: 5,
    text: "Lucía hizo una limpieza profunda increíble. La casa quedó impecable. Ya la reservé para el mes que viene.",
    service: "Limpieza",
    avatar: "ML",
  },
  {
    name: "Carolina S.",
    location: "Núñez, CABA",
    rating: 5,
    text: "Contraté a Javier para un mueble a medida. El resultado superó mis expectativas. Lo recomiendo 100%.",
    service: "Carpintería",
    avatar: "CS",
  },
];

const brandLogos = [
  "Mercado Libre", "Naranja X", "YPF", "Galicia", "Telecom",
];

/* ═══════════════════════════════════════════════════════
   Animation variants
   ═══════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════════════════
   Components
   ═══════════════════════════════════════════════════════ */

function SectionHeader({
  label,
  title,
  subtitle,
  align = "center",
}: {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto mb-12" : "mb-12"}>
      {label && (
        <span className="inline-block text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ProviderCard({ provider, index }: { provider: typeof featuredProviders[number]; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-card-hover hover:border-primary/20 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          alt={provider.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          src={provider.img}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Favorite */}
        <button className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-slate-500 hover:text-red-500 transition-colors shadow-sm" aria-label="Guardar favorito">
          <span className="material-symbols-outlined text-lg">favorite</span>
        </button>
        {/* Badge */}
        {provider.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[10px] font-black rounded-md uppercase tracking-wider shadow-sm">
            {provider.badge}
          </div>
        )}
        {/* Category + Distance */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm text-[11px] font-bold text-slate-700 dark:text-slate-200 rounded-md">
            {provider.category}
          </span>
          <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm text-[11px] font-bold text-slate-500 dark:text-slate-400 rounded-md flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">near_me</span>
            {provider.distance}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`material-symbols-outlined text-[14px] fill-current ${
                  i < Math.floor(provider.rating) ? "text-yellow-400" : "text-slate-200 dark:text-slate-700"
                }`}
              >
                star
              </span>
            ))}
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white">{provider.rating}</span>
          <span className="text-xs text-slate-400">({provider.reviews})</span>
          {provider.verified && (
            <span className="material-symbols-outlined text-[14px] text-primary fill-current ml-auto" title="Verificado">
              verified
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
          {provider.name}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-1">
          {provider.specialty}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Desde</p>
            <p className="font-black text-slate-900 dark:text-white text-lg">{provider.price}</p>
          </div>
          <Link
            href={`/providers/${provider.name.toLowerCase().replace(/\s/g, "-")}`}
            className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════ */

export default function HomePage() {
  const topCategories = [...categories]
    .sort((a, b) => b.providerCount - a.providerCount)
    .slice(0, 8);

  return (
    <div className="relative min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <Header />

      {/* ── Hero ─────────────────────────────────── */}
      <HomeHero />

      {/* ── Categories ───────────────────────────── */}
      <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
        <Container>
          <SectionHeader
            label="Servicios"
            title="Encontrá el profesional perfecto"
            subtitle="Explorá nuestras categorías más populares y conectá con expertos verificados en tu zona."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {topCategories.map((cat, i) => (
              <motion.div key={cat.id} custom={i} variants={fadeUp}>
                <Link
                  href={`/services/${cat.slug}`}
                  className="flex items-center gap-4 p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:bg-primary group-hover:shadow-primary/20 transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors">
                      {cat.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors truncate">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {cat.providerCount} profesionales
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-lg">
                    chevron_right
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors group"
            >
              Ver todas las categorías
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-background-dark relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <SectionHeader
            label="Cómo funciona"
            title="Tu servicio en 4 simples pasos"
            subtitle="Desde la búsqueda hasta la calificación final, todo en un solo lugar."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeUp}
                className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 group"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-1 md:-top-4 md:-left-2 text-[64px] md:text-[80px] font-black text-primary/[0.06] dark:text-primary/[0.08] leading-none select-none pointer-events-none">
                  {item.step}
                </div>
                {/* Icon */}
                <div className="relative w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl text-primary group-hover:text-white transition-colors">
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
                {/* Connector line (hidden on last + mobile) */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 md:-right-5 w-8 md:w-10 border-t-2 border-dashed border-slate-200 dark:border-slate-700" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── Featured Providers ───────────────────── */}
      <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <span className="inline-block text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
                Destacados
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                Profesionales mejor valorados
              </h2>
              <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
                Los favoritos de nuestra comunidad, verificados y con las mejores reseñas.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors group shrink-0"
            >
              Ver todos
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProviders.map((provider, i) => (
              <ProviderCard key={provider.name} provider={provider} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-background-dark relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
        <Container className="relative z-10">
          <SectionHeader
            label="Testimonios"
            title="Lo que dicen nuestros usuarios"
            subtitle="Miles de personas confían en Taskao para resolver sus necesidades del hogar."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={fadeUp}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 hover:shadow-card-hover transition-all duration-300 relative"
              >
                {/* Quote mark */}
                <span className="absolute top-4 right-6 text-5xl text-primary/[0.08] dark:text-primary/[0.12] font-serif leading-none select-none pointer-events-none">&ldquo;</span>
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-yellow-400 text-[16px] fill-current">
                      star
                    </span>
                  ))}
                </div>
                {/* Text */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.location} &middot; {t.service}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── Trust / Brands ───────────────────────── */}
      <section className="py-14 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
        <Container>
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
            Profesionales que trabajan con las mejores empresas
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-12 gap-y-4">
            {brandLogos.map((brand) => (
              <span
                key={brand}
                className="text-lg font-black text-slate-300 dark:text-slate-700 tracking-tight select-none"
              >
                {brand}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Provider CTA ─────────────────────────── */}
      <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-[11px] font-bold uppercase tracking-widest mb-6">
                  <span className="material-symbols-outlined text-[14px] text-primary-light">bolt</span>
                  Para profesionales
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                  Hacé crecer tu negocio
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-violet-400">
                    con Taskao
                  </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                  Llegá a miles de clientes nuevos, gestioná tu agenda y cobrá de forma segura. Registrarte es gratis.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/register/provider"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    Registrate como Pro
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/10 transition-all duration-200"
                  >
                    Saber más
                  </Link>
                </div>
              </div>

              {/* Stats mini cards */}
              <div className="grid grid-cols-2 gap-4 shrink-0">
                {[
                  { icon: "groups", value: "50K+", label: "Profesionales activos" },
                  { icon: "star", value: "4.9", label: "Calificación promedio" },
                  { icon: "payments", value: "100%", label: "Cobro garantizado" },
                  { icon: "speed", value: "< 2h", label: "Tiempo de respuesta" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary-light text-2xl mb-2 block">
                      {stat.icon}
                    </span>
                    <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Final CTA ────────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-background-dark">
        <Container maxW="3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
              ¿Listo para encontrar a tu profesional?
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Miles de expertos verificados están disponibles ahora mismo en tu zona.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-200 text-base"
              >
                <span className="material-symbols-outlined">search</span>
                Explorar servicios
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:shadow-md transition-all duration-200 text-base"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
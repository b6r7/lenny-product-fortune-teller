"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const PARTICLE_COUNT = 24

const heroParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 90}%`,
  size: Math.random() * 2.5 + 1,
  delay: Math.random() * 8,
  duration: Math.random() * 5 + 7,
  isGold: Math.random() > 0.35,
}))

const Hero = () => {
  return (
    <motion.section
      className="relative w-full overflow-hidden"
      aria-label="Hero illustration"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* ——— IMAGE CONTAINER ——— */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[420px]">
        <div className="absolute inset-0 animate-hero-float">
          <Image
            src="/hero/lenny-wizard.png"
            alt="Lenny the Fortune Teller gazing into a crystal ball"
            fill
            priority
            className="object-cover object-[center_25%]"
            style={{
              filter: "saturate(0.85) contrast(1.08) brightness(0.7)",
            }}
          />
        </div>
      </div>

      {/* ——— ATMOSPHERIC TOP GRADIENT ——— */}
      <div
        className="absolute top-0 left-0 w-full h-[40%] z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,12,42,0.6) 0%, rgba(11,11,15,0.15) 60%, transparent 100%)",
        }}
      />

      {/* ——— BOTTOM FADE (kills baked text, blends to bg) ——— */}
      <div
        className="absolute bottom-0 left-0 w-full h-[60%] z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(11,11,15,0.35) 25%, rgba(11,11,15,0.75) 55%, rgba(11,11,15,0.95) 75%, #0B0B0F 100%)",
        }}
      />

      {/* ——— VIGNETTE ——— */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 40%, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* ——— SIDE CURTAIN FADE ——— */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(11,11,15,0.5) 0%, transparent 15%, transparent 85%, rgba(11,11,15,0.5) 100%)",
        }}
      />

      {/* ——— CRYSTAL BALL GLOW (centered warm spot) ——— */}
      <div
        className="absolute z-10 pointer-events-none animate-hero-glow"
        style={{
          left: "50%",
          bottom: "30%",
          width: "300px",
          height: "200px",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at center, rgba(245,196,81,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ——— GOLD / VIOLET PARTICLES ——— */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {heroParticles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-float-particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.isGold
                ? "radial-gradient(circle, rgba(245,196,81,0.9) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(167,139,250,0.7) 0%, transparent 70%)",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </motion.section>
  )
}

export default Hero

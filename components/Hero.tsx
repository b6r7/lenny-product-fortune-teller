"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/lenny-product-fortune-teller" : ""

const PARTICLE_COUNT = 20

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

const round2 = (n: number) => Math.round(n * 100) / 100

const heroParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const size = round2(seededRandom(i * 3 + 3) * 2.5 + 1)
  return {
    id: i,
    left: `${round2(seededRandom(i * 3 + 1) * 100)}%`,
    top: `${round2(seededRandom(i * 3 + 2) * 90)}%`,
    size: `${size}px`,
    delay: `${round2(seededRandom(i * 7 + 4) * 8)}s`,
    duration: `${round2(seededRandom(i * 7 + 5) * 5 + 7)}s`,
    isGold: seededRandom(i * 7 + 6) > 0.35,
  }
})

const Hero = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.section
      className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[580px] overflow-hidden"
      aria-label="Hero illustration"
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* ——— IMAGE (parallax + mask fade) ——— */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      >
        <div className="absolute inset-0 animate-hero-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/hero/lenny-wizard.png`}
            alt="Lenny the Fortune Teller gazing into a crystal ball"
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 50%, transparent 95%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 50%, transparent 95%)",
            }}
          />
        </div>
      </div>

      {/* ——— DARK FADE (image bottom → app bg) ——— */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.7) 72%, rgba(0,0,0,0.92) 85%, #000 97%)",
        }}
      />

      {/* ——— VIGNETTE (edge darkness) ——— */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 35%, transparent 45%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* ——— SOFT PURPLE GLOW ——— */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, rgba(91,46,255,0.1) 0%, transparent 55%)",
          filter: "blur(40px)",
        }}
      />

      {/* ——— CRYSTAL BALL WARM GLOW ——— */}
      <div
        className="absolute pointer-events-none animate-hero-glow"
        style={{
          left: "50%",
          top: "50%",
          width: "350px",
          height: "250px",
          transform: "translate(-50%, -20%)",
          background:
            "radial-gradient(ellipse at center, rgba(245,196,81,0.1) 0%, transparent 65%)",
        }}
      />

      {/* ——— GOLD / VIOLET PARTICLES ——— */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
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
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </motion.section>
  )
}

export default Hero

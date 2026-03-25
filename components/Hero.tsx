"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const PARTICLE_COUNT = 20

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

const Hero = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const heroParticles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${seededRandom(i * 3 + 1) * 100}%`,
        top: `${seededRandom(i * 3 + 2) * 90}%`,
        size: seededRandom(i * 3 + 3) * 2.5 + 1,
        delay: seededRandom(i * 7 + 4) * 8,
        duration: seededRandom(i * 7 + 5) * 5 + 7,
        isGold: seededRandom(i * 7 + 6) > 0.35,
      })),
    []
  )

  return (
    <motion.section
      className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[540px] overflow-hidden"
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
          <Image
            src="/hero/lenny-wizard.png"
            alt="Lenny the Fortune Teller gazing into a crystal ball"
            fill
            priority
            className="object-cover object-center"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 40%, transparent 92%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 40%, transparent 92%)",
            }}
          />
        </div>
      </div>

      {/* ——— DARK PURPLE FADE (matches bg) ——— */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(18,12,42,0.15) 35%, rgba(18,12,42,0.45) 55%, rgba(11,11,15,0.8) 75%, #0B0B0F 95%)",
        }}
      />

      {/* ——— VIGNETTE (edge darkness) ——— */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 40%, transparent 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* ——— SOFT PURPLE GLOW (mystical atmosphere) ——— */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, rgba(91,46,255,0.12) 0%, transparent 60%)",
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

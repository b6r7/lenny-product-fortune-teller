"use client"

import { useState, useEffect } from "react"

type Particle = {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
}

const PALETTE = [
  "rgba(245, 196, 81, 0.12)",
  "rgba(91, 46, 255, 0.1)",
  "rgba(167, 139, 250, 0.08)",
  "rgba(255, 255, 255, 0.04)",
]

const Particles = () => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 10 + Math.random() * 16,
        delay: -(Math.random() * 20),
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }))
    )
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            filter: `blur(${p.size > 3.5 ? 2 : 1}px)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default Particles

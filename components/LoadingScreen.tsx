"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { playShuffle } from "@/lib/sounds"

const MESSAGES = [
  "shuffling the deck…",
  "reading the signals…",
  "this might sting…",
]

type LoadingScreenProps = {
  onComplete: () => void
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [messageIndex, setMessageIndex] = useState(0)
  const stableOnComplete = useCallback(onComplete, [onComplete])

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 15 + Math.random() * 70,
        y: 25 + Math.random() * 50,
        size: 2 + Math.random() * 2.5,
        delay: Math.random() * 1.2,
      })),
    []
  )

  useEffect(() => {
    playShuffle()

    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setMessageIndex(1), 700))
    timers.push(setTimeout(() => setMessageIndex(2), 1400))
    timers.push(setTimeout(() => stableOnComplete(), 2300))

    return () => timers.forEach(clearTimeout)
  }, [stableOnComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(11, 11, 15, 0.97)" }}
    >
      {/* Sparkle particles */}
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: "rgba(245, 196, 81, 0.35)",
            filter: "blur(1px)",
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.3, 0.5],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 5-card shuffle */}
      <div className="relative w-28 h-40 sm:w-32 sm:h-44 mb-14">
        {[0, 1, 2, 3, 4].map(i => {
          const spread = (i - 2) * 55
          const angle = (i - 2) * 13

          return (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-xl border border-[rgba(245,196,81,0.14)]"
              style={{ background: "linear-gradient(135deg, #1c1235, #0e081e)" }}
              animate={{
                x: [0, spread, spread * 0.7, 0],
                y: [0, -30, -15, 0],
                rotate: [0, angle, angle * 0.7, 0],
                scale: [1, 0.92, 0.96, 1],
              }}
              transition={{
                duration: 1.6,
                ease: [0.25, 0.1, 0.25, 1],
                times: [0, 0.35, 0.65, 1],
                repeat: Infinity,
                repeatDelay: 0.05,
              }}
            >
              <div className="absolute inset-2 border border-[rgba(245,196,81,0.06)] rounded-lg flex items-center justify-center">
                <span className="text-[rgba(245,196,81,0.2)] text-base select-none">
                  ✦
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Cycling text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="font-serif text-lg text-[#fefefe] italic"
        >
          {MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

export default LoadingScreen

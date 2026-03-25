"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Background from "@/components/Background"
import Hero from "@/components/Hero"
import InputPanel from "@/components/InputPanel"
import LoadingScreen from "@/components/LoadingScreen"
import Deck from "@/components/Deck"
import { generateReading, type ReadingCard, type ReadingConfidence } from "@/lib/generateReading"
import { playWhoosh } from "@/lib/sounds"

type Phase = "input" | "loading" | "reveal"

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const NUDGE_LINES = [
  "The cards need something real to work with.",
  "Lenny can\u2019t read your fortune without a product problem.",
  "Try describing a real situation \u2014 the cards will know what to do.",
  "That\u2019s not enough for the deck. Tell Lenny about your product.",
]

const Home = () => {
  const [phase, setPhase] = useState<Phase>("input")
  const [displayText, setDisplayText] = useState("")
  const [cards, setCards] = useState<ReadingCard[]>([])
  const [confidence, setConfidence] = useState<ReadingConfidence>("low")
  const [nudge, setNudge] = useState("")

  const handleDeal = useCallback((payload: { matchText: string; displayText: string }) => {
    setNudge("")

    const result = generateReading(payload.matchText)

    if (!result) {
      const line = NUDGE_LINES[Math.floor(Math.random() * NUDGE_LINES.length)]
      setNudge(line)
      return
    }

    playWhoosh()
    setDisplayText(payload.displayText)
    setCards(result.cards)
    setConfidence(result.confidence)
    setPhase("loading")
  }, [])

  const handleLoadingComplete = useCallback(() => {
    setPhase("reveal")
  }, [])

  const handleReset = useCallback(() => {
    playWhoosh()
    setPhase("input")
    setDisplayText("")
    setCards([])
    setConfidence("low")
    setNudge("")
  }, [])

  return (
    <main className="relative min-h-screen bg-black">
      <Background />

      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, filter: "brightness(0.6)" }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            <Hero />

            <div className="relative z-10 -mt-20 sm:-mt-28 flex flex-col items-center gap-6 px-4 pb-20">
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: EASE_OUT_EXPO }}
                className="text-center"
              >
                <h1 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#B8942E] via-[#FFE08A] to-[#B8942E] mb-3 leading-tight pb-1">
                  Lenny the Fortune Teller
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="font-serif text-base sm:text-lg text-[#fefefe] italic"
                >
                  Ask, and the cards will answer.
                </motion.p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="font-body text-sm text-[#fefefe]/70 tracking-wide"
              >
                Describe your situation. Lenny will deal the cards.
              </motion.p>

              <InputPanel onSubmit={handleDeal} />

              <AnimatePresence>
                {nudge && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.35 }}
                    className="font-serif text-sm text-[rgba(245,196,81,0.65)] italic text-center max-w-md"
                  >
                    {nudge}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading-wrap"
            className="min-h-screen flex items-center justify-center px-4"
          >
            <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16 w-full"
          >
            <Deck cards={cards} userInput={displayText} confidence={confidence} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Home

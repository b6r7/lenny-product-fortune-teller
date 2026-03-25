"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Background from "@/components/Background"
import InputPanel from "@/components/InputPanel"
import LoadingScreen from "@/components/LoadingScreen"
import Deck from "@/components/Deck"
import { generateReading, type ReadingCard } from "@/lib/generateReading"
import { playWhoosh } from "@/lib/sounds"

type Phase = "input" | "loading" | "reveal"

const Home = () => {
  const [phase, setPhase] = useState<Phase>("input")
  const [userInput, setUserInput] = useState("")
  const [cards, setCards] = useState<ReadingCard[]>([])

  const handleDeal = useCallback((input: string) => {
    playWhoosh()
    setUserInput(input)
    const reading = generateReading(input)
    setCards(reading)
    setPhase("loading")
  }, [])

  const handleLoadingComplete = useCallback(() => {
    setPhase("reveal")
  }, [])

  const handleReset = useCallback(() => {
    playWhoosh()
    setPhase("input")
    setUserInput("")
    setCards([])
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      <Background />

      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03, filter: "brightness(0.6)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8 w-full"
          >
            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-2"
            >
              <h1 className="font-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-[#B8942E] via-[#FFE08A] to-[#B8942E] mb-5 leading-tight pb-1">
                Lenny the Fortune Teller
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-serif text-lg sm:text-xl text-text-secondary/60 italic"
              >
                Describe your situation. Lenny will deal the cards.
              </motion.p>
            </motion.div>

            <InputPanel onSubmit={handleDeal} />
          </motion.div>
        )}

        {phase === "loading" && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <Deck cards={cards} userInput={userInput} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Home

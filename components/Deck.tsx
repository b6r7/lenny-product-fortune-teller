"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toPng } from "html-to-image"
import Card from "./Card"
import VoiceLine from "./VoiceLine"
import PlanView from "./PlanView"
import ExportLayout from "./ExportLayout"
import type { ReadingCard } from "@/lib/generateReading"
import { playChime } from "@/lib/sounds"

type DeckProps = {
  cards: ReadingCard[]
  userInput: string
  onReset: () => void
}

const Deck = ({ cards, userInput, onReset }: DeckProps) => {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const [actionMode, setActionMode] = useState(false)
  const [exportFeedback, setExportFeedback] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)
  const allRevealed = flipped.size === 3

  useEffect(() => {
    if (!allRevealed) return
    const timer = setTimeout(() => playChime(), 350)
    return () => clearTimeout(timer)
  }, [allRevealed])

  const handleFlip = (index: number) => {
    setFlipped(prev => new Set(prev).add(index))
  }

  const handleToggleMode = () => {
    setActionMode(prev => !prev)
  }

  const handleExport = useCallback(async () => {
    if (!exportRef.current) return

    try {
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: 1200,
        height: 1600,
      })

      const link = document.createElement("a")
      link.download = `lenny-reading-${Date.now()}.png`
      link.href = dataUrl
      link.click()

      setExportFeedback(true)
      setTimeout(() => setExportFeedback(false), 2500)
    } catch (err) {
      console.error("Export failed:", err)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8 sm:gap-12 py-8"
    >
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-serif text-base sm:text-lg text-[#fefefe]/70 italic text-center max-w-lg px-4"
      >
        &ldquo;{userInput}&rdquo;
      </motion.p>

      <AnimatePresence>
        {!allRevealed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.8 }}
            className="text-[#fefefe]/70 text-sm font-body tracking-wide"
          >
            Click a card to reveal your truth
          </motion.p>
        )}
      </AnimatePresence>

      {/* Mode toggle */}
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.button
              onClick={handleToggleMode}
              onKeyDown={e => e.key === "Enter" && handleToggleMode()}
              aria-label={actionMode ? "Switch to interpretation mode" : "Switch to action mode"}
              tabIndex={0}
              className="group relative px-6 py-2.5 rounded-full font-body text-xs tracking-[0.12em] cursor-pointer transition-all duration-400 overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              <div
                className={`absolute inset-0 rounded-full transition-all duration-400 ${
                  actionMode
                    ? "bg-[rgba(91,46,255,0.12)] border border-[rgba(91,46,255,0.3)]"
                    : "bg-[rgba(245,196,81,0.06)] border border-[rgba(245,196,81,0.2)]"
                }`}
              />
              <span className="relative flex items-center gap-2">
                <span className="text-sm leading-none">{actionMode ? "🔮" : "🧠"}</span>
                <span className={`transition-colors duration-300 ${
                  actionMode ? "text-purple-bright" : "text-gold-mid"
                }`}>
                  {actionMode ? "Return to the reading" : "Break the spell"}
                </span>
              </span>
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.p
                key={actionMode ? "action-copy" : "mystic-copy"}
                initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                animate={{ opacity: 0.4, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="font-body text-[11px] text-[#fefefe]/60 tracking-wide"
              >
                {actionMode
                  ? "Alright. Here\u2019s what to actually do."
                  : "Back to the cards\u2026"}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        {cards.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            index={i}
            isFlipped={flipped.has(i)}
            onFlip={() => handleFlip(i)}
            allRevealed={allRevealed}
            actionMode={actionMode}
          />
        ))}
      </div>

      {/* Bottom actions */}
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-col items-center gap-6 mt-4"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={actionMode ? "action-headline" : "mystic-headline"}
                initial={{ opacity: 0, letterSpacing: "0.3em", filter: "blur(4px)" }}
                animate={{
                  opacity: 0.45,
                  letterSpacing: "0.2em",
                  filter: "blur(0px)",
                }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="font-title text-[11px] uppercase text-gold-mid"
              >
                {actionMode
                  ? "Now go do something about it."
                  : "You knew at least one of these already."}
              </motion.p>
            </AnimatePresence>

            {!actionMode && <VoiceLine />}

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <motion.button
                onClick={onReset}
                onKeyDown={e => e.key === "Enter" && onReset()}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 24px rgba(245,196,81,0.12)",
                }}
                whileTap={{ scale: 0.96 }}
                aria-label="Ask again"
                tabIndex={0}
                className="px-8 sm:px-10 py-3.5 rounded-xl border border-[rgba(245,196,81,0.2)] text-gold-mid font-title text-sm tracking-[0.15em] hover:bg-[rgba(245,196,81,0.06)] transition-all duration-300 cursor-pointer"
              >
                → Ask Again
              </motion.button>

              <motion.button
                onClick={() => setShowPlan(true)}
                onKeyDown={e => e.key === "Enter" && setShowPlan(true)}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 24px rgba(91,46,255,0.12)",
                }}
                whileTap={{ scale: 0.96 }}
                aria-label="Turn this into a plan"
                tabIndex={0}
                className="px-8 py-3.5 rounded-xl border border-[rgba(91,46,255,0.2)] text-purple-bright font-title text-sm tracking-[0.15em] hover:bg-[rgba(91,46,255,0.06)] transition-all duration-300 cursor-pointer"
              >
                Turn this into a plan
              </motion.button>

              <motion.button
                onClick={handleExport}
                onKeyDown={e => e.key === "Enter" && handleExport()}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 24px rgba(91,46,255,0.12)",
                }}
                whileTap={{ scale: 0.96 }}
                aria-label="Save this reading as image"
                tabIndex={0}
                className={`px-8 py-3.5 rounded-xl border font-title text-sm tracking-[0.15em] transition-all duration-300 cursor-pointer ${
                  exportFeedback
                    ? "border-[rgba(91,46,255,0.4)] text-purple-bright bg-[rgba(91,46,255,0.08)]"
                    : "border-[rgba(255,255,255,0.1)] text-[#fefefe]/60 hover:text-[#fefefe] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                {exportFeedback ? "✓ Saved" : "Save this reading"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan view */}
      <AnimatePresence>
        {showPlan && allRevealed && (
          <PlanView cards={cards} onClose={() => setShowPlan(false)} />
        )}
      </AnimatePresence>

      {/* Off-screen export layout — rendered but invisible */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <ExportLayout
          ref={exportRef}
          cards={cards}
          userInput={userInput}
          actionMode={actionMode}
        />
      </div>
    </motion.div>
  )
}

export default Deck

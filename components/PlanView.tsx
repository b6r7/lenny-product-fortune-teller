"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import type { ReadingCard } from "@/lib/generateReading"

type PlanItem = {
  id: string
  text: string
  source: string
}

type PrioritizedPlan = {
  now: PlanItem[]
  next: PlanItem[]
  later: PlanItem[]
}

const STORAGE_KEY = "lenny-plan-checked"

const generatePlan = (cards: ReadingCard[]): PrioritizedPlan => {
  const seen = new Set<string>()
  const items: PlanItem[] = []

  for (const card of cards) {
    for (const action of card.actions) {
      const key = action.toLowerCase().trim()
      if (seen.has(key)) continue
      seen.add(key)
      items.push({ id: `${card.id}-${items.length}`, text: action, source: card.title })
      if (items.length >= 5) break
    }
    if (items.length >= 5) break
  }

  return {
    now: items.slice(0, 2),
    next: items.slice(2, 4),
    later: items.slice(4, 5),
  }
}

type PlanViewProps = {
  cards: ReadingCard[]
  onClose: () => void
}

const tiers: { key: keyof PrioritizedPlan; label: string; accent: string }[] = [
  { key: "now", label: "Now", accent: "rgba(245, 196, 81, 0.7)" },
  { key: "next", label: "Next", accent: "rgba(167, 139, 250, 0.6)" },
  { key: "later", label: "Later", accent: "rgba(254, 254, 254, 0.35)" },
]

const PlanView = ({ cards, onClose }: PlanViewProps) => {
  const plan = generatePlan(cards)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setChecked(new Set(JSON.parse(stored)))
    } catch { /* noop */ }
  }, [])

  const handleToggle = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])) } catch { /* noop */ }
      return next
    })
  }, [])

  const totalItems = plan.now.length + plan.next.length + plan.later.length
  const doneCount = [...checked].filter(id =>
    [...plan.now, ...plan.next, ...plan.later].some(item => item.id === id)
  ).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="rounded-2xl border border-white/[0.06] bg-[#0e0b16]/80 backdrop-blur-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[rgba(245,196,81,0.45)] mb-1.5">
              Your plan
            </p>
            <p className="font-serif text-sm text-[#fefefe]/55 italic">
              Based on your reading, here&apos;s what to focus on.
            </p>
          </div>
          <button
            onClick={onClose}
            onKeyDown={e => e.key === "Enter" && onClose()}
            aria-label="Close plan"
            tabIndex={0}
            className="text-[#fefefe]/30 hover:text-[#fefefe]/60 transition-colors cursor-pointer text-lg leading-none mt-0.5"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-body text-[10px] tracking-wide text-[#fefefe]/35">
              Progress
            </span>
            <span className="font-body text-[10px] tracking-wide text-[#fefefe]/35">
              {doneCount}/{totalItems}
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(to right, rgba(245,196,81,0.6), rgba(167,139,250,0.5))",
              }}
              initial={{ width: 0 }}
              animate={{ width: totalItems > 0 ? `${(doneCount / totalItems) * 100}%` : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Tiers */}
        <div className="space-y-6">
          {tiers.map(({ key, label, accent }) => {
            const items = plan[key]
            if (items.length === 0) return null

            return (
              <div key={key}>
                <p
                  className="font-body text-[10px] font-medium uppercase tracking-[0.18em] mb-3"
                  style={{ color: accent }}
                >
                  {label}
                </p>
                <ul className="space-y-2">
                  {items.map((item, i) => {
                    const isDone = checked.has(item.id)
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                        className="group"
                      >
                        <label
                          className="flex items-start gap-3 cursor-pointer py-1.5 rounded-lg transition-colors duration-200 hover:bg-white/[0.02] -mx-2 px-2"
                        >
                          <div className="relative mt-0.5 shrink-0">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => handleToggle(item.id)}
                              className="sr-only peer"
                              aria-label={item.text}
                            />
                            <div
                              className="w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center peer-checked:border-transparent"
                              style={{
                                borderColor: isDone ? "transparent" : "rgba(255,255,255,0.12)",
                                background: isDone
                                  ? "linear-gradient(135deg, rgba(245,196,81,0.5), rgba(167,139,250,0.4))"
                                  : "transparent",
                                boxShadow: isDone ? "0 0 8px rgba(245,196,81,0.15)" : "none",
                              }}
                            >
                              {isDone && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                  className="text-[9px] text-[#0B0B0F] font-bold leading-none"
                                >
                                  ✓
                                </motion.span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className={`font-body text-[13px] leading-snug block transition-all duration-300 ${
                                isDone ? "line-through text-[#fefefe]/25" : "text-[#fefefe]/80"
                              }`}
                            >
                              {item.text}
                            </span>
                            <span className="font-body text-[9px] text-[#fefefe]/20 mt-0.5 block">
                              from {item.source}
                            </span>
                          </div>
                        </label>
                      </motion.li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        {/* All done state */}
        {doneCount === totalItems && totalItems > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center font-serif text-xs text-[rgba(245,196,81,0.5)] italic mt-6 pt-4 border-t border-white/[0.04]"
          >
            All done. The cards would be proud.
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export default PlanView

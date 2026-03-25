"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ReadingCard } from "@/lib/generateReading"
import { playFlip } from "@/lib/sounds"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/lenny-product-fortune-teller" : ""

type CardProps = {
  card: ReadingCard
  index: number
  isFlipped: boolean
  onFlip: () => void
  allRevealed: boolean
  actionMode: boolean
  isExporting?: boolean
}

type Sparkle = {
  id: number
  x: number
  y: number
  size: number
  delay: number
  angle: number
  color: string
}

type DustMote = {
  id: number
  angle: number
  distance: number
  size: number
  delay: number
  color: string
}

const SPARKLE_COUNT = 10
const DUST_COUNT = 16

const MALE_VOICE_PATTERN =
  /daniel|david|alex|fred|jorge|thomas|microsoft mark|google uk english male/i

const getPreferredVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices()
  const male = voices.find(v => MALE_VOICE_PATTERN.test(v.name))
  const english = voices.find(v => v.lang.startsWith("en"))
  return male || english || voices[0] || null
}

const Card = ({ card, index, isFlipped, onFlip, allRevealed, actionMode, isExporting = false }: CardProps) => {
  const [showBurst, setShowBurst] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false)
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    setHasSpeechSupport(true)
    const loadVoices = () => { window.speechSynthesis.getVoices() }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [])

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        id: i,
        x: 25 + Math.random() * 50,
        y: 25 + Math.random() * 50,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 0.2,
        angle: (360 / SPARKLE_COUNT) * i + (Math.random() - 0.5) * 30,
        color: i % 3 === 0 ? "#F5C451" : i % 3 === 1 ? "#a78bfa" : "#FFE08A",
      })),
    [],
  )

  const dustMotes = useMemo<DustMote[]>(
    () =>
      Array.from({ length: DUST_COUNT }, (_, i) => ({
        id: i,
        angle: (360 / DUST_COUNT) * i + (Math.random() - 0.5) * 20,
        distance: 30 + Math.random() * 50,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.08,
        color: i % 2 === 0 ? "#F5C451" : "#a78bfa",
      })),
    [],
  )

  useEffect(() => {
    if (!isFlipped) return
    setShowBurst(true)
    const timer = setTimeout(() => setShowBurst(false), 900)
    return () => clearTimeout(timer)
  }, [isFlipped])

  const handleFlip = () => {
    if (isFlipped) return
    playFlip()
    onFlip()
  }

  const handleListen = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation()
      if (!hasSpeechSupport) return

      if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
      window.speechSynthesis.cancel()

      if (isSpeaking) {
        setIsSpeaking(false)
        return
      }

      const intro = "Your fortune says..."
      const body = `${card.title}. ${card.description}`
      const quote = card.quote ? ` ${card.quote.text}` : ""
      const fullText = `${intro} ${body}${quote}`

      setIsSpeaking(true)

      delayTimerRef.current = setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(fullText)
        const voice = getPreferredVoice()
        if (voice) utterance.voice = voice
        utterance.rate = 0.9
        utterance.pitch = 0.85
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      }, 400)
    },
    [hasSpeechSupport, isSpeaking, card],
  )

  const hasImage = !!card.image

  return (
    <motion.div
      className="relative"
      initial={isExporting ? { opacity: 1, y: 0, rotateZ: 0 } : {
        opacity: 0,
        y: 70,
        rotateZ: index === 0 ? -5 : index === 2 ? 5 : 0,
      }}
      animate={{ opacity: 1, y: 0, rotateZ: 0 }}
      transition={isExporting ? { duration: 0 } : {
        delay: index * 0.18 + 0.2,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => !isExporting && setIsHovered(true)}
      onMouseLeave={() => !isExporting && setIsHovered(false)}
    >
      <motion.div
        animate={
          isExporting
            ? { y: 0, scale: 1 }
            : !isFlipped
              ? { y: [0, -4, 0], scale: 1 }
              : { y: 0, scale: isSpeaking ? 1.02 : 1 }
        }
        transition={
          isExporting
            ? { duration: 0 }
            : !isFlipped
              ? { duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.5, ease: "easeOut" }
        }
      >
        {/* ——— LAYER 0: GLOW / AURA ——— */}
        <motion.div
          className="absolute -inset-8 rounded-3xl pointer-events-none"
          style={{
            background: actionMode
              ? "radial-gradient(ellipse at center, rgba(91,46,255,0.18) 0%, rgba(120,180,255,0.06) 50%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(91,46,255,0.22) 0%, rgba(245,196,81,0.06) 50%, transparent 75%)",
            filter: "blur(40px)",
          }}
          animate={{
            opacity: isExporting
              ? 0.35
              : isSpeaking
                ? 0.7
                : isHovered && !isFlipped
                  ? 0.85
                  : isFlipped
                    ? 0.4
                    : 0.1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        <div className="perspective-800 relative">
          {/* 3D flip container */}
          <motion.div
            onClick={handleFlip}
            onKeyDown={e => e.key === "Enter" && handleFlip()}
            role="button"
            tabIndex={0}
            aria-label={
              isFlipped
                ? `Card revealed: ${card.title}`
                : `Click to reveal card ${index + 1}`
            }
            className={`relative w-56 h-[26rem] sm:w-64 sm:h-[28rem] preserve-3d will-change-transform ${
              !isFlipped && !isExporting ? "cursor-pointer" : ""
            }`}
            animate={{
              rotateY: isFlipped ? 180 : 0,
              scale: isExporting ? 1 : isFlipped ? [1, 1.08, 1] : 1,
            }}
            transition={isExporting ? { duration: 0 } : {
              rotateY: { duration: 0.6, ease: "easeInOut" },
              scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            }}
            whileHover={
              !isFlipped && !isExporting
                ? { y: -6, scale: 1.03, transition: { duration: 0.35, ease: "easeOut" } }
                : {}
            }
          >
            {/* ═══════════ BACK FACE ═══════════ */}
            <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1c1235] via-[#150d28] to-[#0e081e] rounded-2xl animate-card-border-glow">
                <div className="absolute inset-3 border border-[rgba(245,196,81,0.1)] rounded-xl" />
                <div className="absolute inset-6 border border-[rgba(245,196,81,0.05)] rounded-lg" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border border-[rgba(245,196,81,0.2)] rotate-45 rounded-sm" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 border border-[rgba(245,196,81,0.3)] rotate-45 rounded-sm" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[rgba(245,196,81,0.45)] text-2xl select-none">
                        ✦
                      </span>
                    </div>
                  </div>
                </div>

                <span className="absolute top-5 left-5 text-[rgba(245,196,81,0.2)] text-[10px] select-none">✦</span>
                <span className="absolute top-5 right-5 text-[rgba(245,196,81,0.2)] text-[10px] select-none">✦</span>
                <span className="absolute bottom-5 left-5 text-[rgba(245,196,81,0.2)] text-[10px] select-none">✦</span>
                <span className="absolute bottom-5 right-5 text-[rgba(245,196,81,0.2)] text-[10px] select-none">✦</span>

                <div className="absolute top-1/2 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[rgba(245,196,81,0.08)] to-transparent -translate-y-16" />
                <div className="absolute top-1/2 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[rgba(245,196,81,0.08)] to-transparent translate-y-16" />

                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div
                    className="absolute inset-0 animate-card-shimmer"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(245,196,81,0.04) 45%, rgba(245,196,81,0.07) 50%, rgba(245,196,81,0.04) 55%, transparent 60%)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </div>
              </div>

              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(245,196,81,0.12) 0%, transparent 70%)",
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* ═══════════ FRONT FACE ═══════════ */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[#0d0818]" />

              {/* ——— LAYER 1: ILLUSTRATION or SYMBOL FALLBACK ——— */}
              {hasImage ? (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-2xl"
                  animate={
                    isHovered && isFlipped ? { scale: 1.08 } : { scale: 1 }
                  }
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${BASE_PATH}${card.image!}`}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "saturate(0.9) contrast(1.05)" }}
                  />
                  <div
                    className="absolute inset-x-0 top-0 h-[38%]"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(13,8,24,0.88) 0%, rgba(13,8,24,0.55) 55%, transparent 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-[50%]"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(13,8,24,0.97) 0%, rgba(13,8,24,0.85) 35%, transparent 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      boxShadow: "inset 0 0 80px rgba(11,11,15,0.55)",
                    }}
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a1030] via-[#140f25] to-[#0d0818]" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 42%, rgba(91,46,255,0.14) 0%, transparent 55%)",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={
                      isHovered && isFlipped
                        ? { scale: 1.12, opacity: 0.22 }
                        : { scale: 1, opacity: 0.12 }
                    }
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <span className="text-[6rem] sm:text-[7rem] text-gold-mid select-none drop-shadow-[0_0_40px_rgba(245,196,81,0.15)]">
                      {card.symbol}
                    </span>
                  </motion.div>
                  <div className="absolute top-[33%] left-6 right-6 h-px bg-gradient-to-r from-transparent via-[rgba(245,196,81,0.08)] to-transparent" />
                  <div className="absolute bottom-[33%] left-6 right-6 h-px bg-gradient-to-r from-transparent via-[rgba(245,196,81,0.08)] to-transparent" />
                </div>
              )}

              {/* ——— LAYER 2: BORDER / FRAME ——— */}
              <div className="absolute inset-0 rounded-2xl border border-[rgba(245,196,81,0.3)] pointer-events-none" />
              <div className="absolute inset-[3px] rounded-[14px] border border-[rgba(245,196,81,0.1)] pointer-events-none" />

              <span className="absolute top-3 left-3 text-[rgba(245,196,81,0.35)] text-[10px] select-none pointer-events-none">✦</span>
              <span className="absolute top-3 right-3 text-[rgba(245,196,81,0.35)] text-[10px] select-none pointer-events-none">✦</span>
              <span className="absolute bottom-3 left-3 text-[rgba(245,196,81,0.35)] text-[10px] select-none pointer-events-none">✦</span>
              <span className="absolute bottom-3 right-3 text-[rgba(245,196,81,0.35)] text-[10px] select-none pointer-events-none">✦</span>

              <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none">
                <span className="text-[rgba(245,196,81,0.25)] text-xs select-none">☽</span>
              </div>

              <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
                <span className="text-[rgba(245,196,81,0.2)] text-[10px] select-none">◇</span>
              </div>

              <div className="absolute top-8 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[rgba(245,196,81,0.12)] to-transparent pointer-events-none" />

              {/* ——— GRAIN OVERLAY ——— */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-overlay"
                style={{
                  opacity: 0.04,
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
              />

              {/* ——— SHIMMER SWEEP ——— */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div
                  className="absolute inset-0 animate-card-shimmer"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(245,196,81,0.03) 45%, rgba(245,196,81,0.06) 50%, rgba(245,196,81,0.03) 55%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>

              {/* ——— SPEAKING GLOW PULSE ——— */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    className="absolute -inset-px rounded-2xl pointer-events-none z-30"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      boxShadow: [
                        "0 0 10px rgba(91,46,255,0.15), inset 0 0 10px rgba(91,46,255,0.06)",
                        "0 0 22px rgba(91,46,255,0.35), inset 0 0 14px rgba(91,46,255,0.1)",
                        "0 0 10px rgba(91,46,255,0.15), inset 0 0 10px rgba(91,46,255,0.06)",
                      ],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      boxShadow: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 0.3 },
                    }}
                  />
                )}
              </AnimatePresence>

              {/* ——— TEXT SCRIM ——— */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 100%)",
                }}
              />

              {/* ——— LAYER 3: CONTENT ——— */}
              <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
                {/* Top section: tag + title + subtitle */}
                <div>
                  <motion.p
                    initial={isExporting ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                    animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                    transition={isExporting ? { duration: 0 } : { delay: 0.3, duration: 0.4 }}
                    className="text-[10px] uppercase tracking-[0.22em] text-[rgba(245,196,81,0.6)] font-body font-medium mb-1"
                  >
                    {card.tag}
                  </motion.p>

                  <motion.h3
                    initial={isExporting ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={isExporting ? { duration: 0 } : { delay: 0.38, duration: 0.45 }}
                    className="font-title text-xl sm:text-2xl text-[#fefefe] leading-tight"
                  >
                    {card.title}
                  </motion.h3>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={actionMode ? "action-sub" : "mystic-sub"}
                      initial={isExporting ? { opacity: 0.5 } : { opacity: 0 }}
                      animate={isFlipped ? { opacity: 0.5 } : { opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={isExporting ? { duration: 0 } : { delay: isFlipped ? 0.46 : 0, duration: 0.3 }}
                      className={`text-xs mt-1 ${
                        actionMode
                          ? "font-body tracking-wide text-purple-bright"
                          : "font-serif italic text-[#fefefe]"
                      }`}
                    >
                      {actionMode ? card.actionTitle : card.subtitle}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Bottom section: insight/action crossfade */}
                <div className="min-h-[120px] flex flex-col justify-end">
                  <AnimatePresence mode="wait">
                    {isFlipped && !actionMode && (
                      <motion.div
                        key="mystic"
                        initial={isExporting ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 6, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -4, filter: "blur(6px)" }}
                        transition={isExporting ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
                      >
                        <p className="font-body text-sm text-[#fefefe] leading-relaxed">
                          {card.description}
                        </p>

                        {card.quote && (
                          <div className="mt-3 pt-3 border-t border-[rgba(245,196,81,0.1)]">
                            <p className="font-serif text-xs text-[rgba(254,254,254,0.6)] italic leading-relaxed line-clamp-3">
                              &ldquo;{card.quote.text}&rdquo;
                            </p>
                            <p className="font-body text-[9px] text-[rgba(184,148,46,0.4)] mt-1.5 tracking-wide">
                              — {card.quote.source}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {isFlipped && actionMode && card.actions.length > 0 && (
                      <motion.div
                        key="action"
                        initial={isExporting ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 6, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -4, filter: "blur(6px)" }}
                        transition={isExporting ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
                      >
                        <h4 className="font-body text-[11px] font-medium tracking-[0.1em] uppercase text-[rgba(245,196,81,0.7)] mb-2.5">
                          What to do
                        </h4>
                        <ul className="space-y-1.5">
                          {card.actions.map((action, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07, duration: 0.25 }}
                              className="font-body text-[12px] text-[#fefefe] leading-snug flex gap-2"
                            >
                              <span className="text-[rgba(245,196,81,0.5)] shrink-0 mt-px">•</span>
                              <span>{action}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ——— LISTEN BUTTON ——— */}
                  {isFlipped && hasSpeechSupport && !actionMode && !isExporting && (
                    <motion.button
                      onClick={handleListen}
                      onKeyDown={e => e.key === "Enter" && handleListen(e)}
                      aria-label={
                        isSpeaking ? "Stop speaking" : `Listen to ${card.title}`
                      }
                      tabIndex={0}
                      className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-[10px] tracking-wide cursor-pointer transition-colors duration-300 ${
                        isSpeaking
                          ? "bg-[rgba(91,46,255,0.15)] border border-[rgba(91,46,255,0.35)] text-purple-bright"
                          : "bg-white/[0.04] border border-white/[0.08] text-text-muted hover:text-gold-mid hover:border-[rgba(245,196,81,0.25)] hover:bg-[rgba(245,196,81,0.06)]"
                      }`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.4 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <span className="text-xs leading-none">
                        {isSpeaking ? "✦" : "🔮"}
                      </span>
                      <span>{isSpeaking ? "Speaking…" : "Listen"}</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ——— GLOW BURST on flip ——— */}
          <AnimatePresence>
            {showBurst && !isExporting && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0, 1, 0], scale: [0.9, 1.3, 1.5] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  background:
                    "radial-gradient(circle, rgba(245,196,81,0.3) 0%, rgba(91,46,255,0.12) 40%, transparent 70%)",
                }}
              />
            )}
          </AnimatePresence>

          {/* ——— FLASH overlay on flip ——— */}
          <AnimatePresence>
            {showBurst && !isExporting && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none z-10 bg-white/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 0.35 }}
              />
            )}
          </AnimatePresence>

          {/* ——— SPARKLE PARTICLES on flip ——— */}
          <AnimatePresence>
            {showBurst && !isExporting &&
              sparkles.map(s => (
                <motion.div
                  key={s.id}
                  className="absolute rounded-full pointer-events-none z-20"
                  style={{
                    width: s.size,
                    height: s.size,
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    background: s.color,
                    boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.8, 0],
                    x: Math.cos((s.angle * Math.PI) / 180) * 50,
                    y: Math.sin((s.angle * Math.PI) / 180) * 50,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: s.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
          </AnimatePresence>

          {/* ——— DUST REVEAL burst from center ——— */}
          <AnimatePresence>
            {showBurst && !isExporting &&
              dustMotes.map(d => (
                <motion.div
                  key={`dust-${d.id}`}
                  className="absolute rounded-full pointer-events-none z-20"
                  style={{
                    width: d.size,
                    height: d.size,
                    left: "50%",
                    top: "50%",
                    marginLeft: -d.size / 2,
                    marginTop: -d.size / 2,
                    background: d.color,
                    boxShadow: `0 0 ${d.size}px ${d.color}`,
                  }}
                  initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
                  animate={{
                    opacity: [0.6, 0],
                    scale: [0.8, 1.2],
                    x: Math.cos((d.angle * Math.PI) / 180) * d.distance,
                    y: Math.sin((d.angle * Math.PI) / 180) * d.distance,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: d.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
          </AnimatePresence>

          {/* ——— ALL-REVEALED gold pulse ——— */}
          {allRevealed && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ boxShadow: "0 0 0px rgba(245,196,81,0)" }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(245,196,81,0)",
                  "0 0 35px rgba(245,196,81,0.22)",
                  "0 0 0px rgba(245,196,81,0)",
                ],
              }}
              transition={{ duration: 1.5, delay: 0.3 + index * 0.2 }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Card

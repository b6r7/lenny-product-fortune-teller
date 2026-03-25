"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const InfoToggle = () => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKey)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, handleClose])

  return (
    <div ref={containerRef} className="fixed top-5 left-5 z-[200]">
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={open ? "Close info" : "About this project"}
        tabIndex={0}
        className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#fefefe]/60 hover:text-[#fefefe] hover:bg-white/[0.08] transition-colors cursor-pointer backdrop-blur-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-14 left-0 w-[290px] rounded-xl border border-[#F5C451]/20 bg-[#12121A]/95 backdrop-blur-md p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <p className="text-xs text-white/80 leading-relaxed">
              <strong className="text-[#F5C451]/80">Lenny Rachitsky</strong>{" "}is one of the most
              influential voices in product — author of Lenny&apos;s Newsletter and host of a
              top-tier podcast with founders and operators behind Airbnb, Stripe, and Figma.
            </p>

            <p className="text-xs text-white/55 mt-3 leading-relaxed">
              This project compresses 300+ episodes of product intuition into an interactive
              fortune reading — fast, slightly uncomfortable, and actually useful.
            </p>

            <p className="text-[11px] text-white/35 mt-3 italic leading-relaxed">
              Built by Bart Andrzejewski — exploring how AI transforms raw knowledge into
              decision tools, not just content.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InfoToggle

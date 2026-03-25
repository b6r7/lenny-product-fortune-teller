"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { getRandomVoiceLine } from "@/lib/quotes"

const VoiceLine = () => {
  const line = useMemo(() => getRandomVoiceLine(), [])
  const [displayed, setDisplayed] = useState("")
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index >= line.length) {
        clearInterval(interval)
        setTimeout(() => setIsDone(true), 1000)
        return
      }
      setDisplayed(line.slice(0, index + 1))
      index++
    }, 36)

    return () => clearInterval(interval)
  }, [line])

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="font-serif text-base sm:text-lg text-gold-mid italic text-center max-w-md px-4"
    >
      &ldquo;{displayed}
      {!isDone && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.45, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block ml-0.5 text-gold-mid/70"
        >
          |
        </motion.span>
      )}
      {isDone && <>&rdquo;</>}
    </motion.p>
  )
}

export default VoiceLine

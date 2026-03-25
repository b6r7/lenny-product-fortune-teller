"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { extractTextFromImage } from "@/lib/ocr"
import { extractContentFromUrl } from "@/lib/urlParser"

type InputType = "describe" | "url" | "screenshot"

type SubmitPayload = {
  matchText: string
  displayText: string
}

type InputPanelProps = {
  onSubmit: (payload: SubmitPayload) => void
}

const tabs: { id: InputType; label: string }[] = [
  { id: "describe", label: "Describe" },
  { id: "url", label: "Paste URL" },
  { id: "screenshot", label: "Upload Screenshot" },
]

const InputPanel = ({ onSubmit }: InputPanelProps) => {
  const [activeTab, setActiveTab] = useState<InputType>("describe")
  const [textInput, setTextInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [processing, setProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const hasInput =
    (activeTab === "describe" && textInput.trim().length > 0) ||
    (activeTab === "url" && urlInput.trim().length > 0) ||
    (activeTab === "screenshot" && screenshot !== null)

  const handleSubmit = async () => {
    if (!hasInput || processing) return

    if (activeTab === "describe") {
      const text = textInput.trim()
      onSubmit({ matchText: text, displayText: text })
      return
    }

    if (activeTab === "url") {
      setProcessing(true)
      setProcessingMessage("Analyzing your link...")
      try {
        const content = await extractContentFromUrl(urlInput.trim())
        onSubmit({
          matchText: content || urlInput.trim(),
          displayText: urlInput.trim(),
        })
      } catch {
        onSubmit({ matchText: urlInput.trim(), displayText: urlInput.trim() })
      } finally {
        setProcessing(false)
        setProcessingMessage("")
      }
      return
    }

    if (activeTab === "screenshot" && screenshot) {
      setProcessing(true)
      setProcessingMessage("Reading your screenshot...")
      try {
        const result = await extractTextFromImage(screenshot)
        onSubmit({
          matchText: result.matchText || fileName || "screenshot",
          displayText: result.displayText,
        })
      } catch {
        onSubmit({ matchText: fileName || "screenshot", displayText: "Uploaded screenshot" })
      } finally {
        setProcessing(false)
        setProcessingMessage("")
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) handleSubmit()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setScreenshot(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleClearScreenshot = () => {
    setScreenshot(null)
    setFileName("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Tab bar */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-[#131318]/80 backdrop-blur-sm border border-white/[0.04]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-label={`Switch to ${tab.label} input`}
            tabIndex={0}
            className={`relative flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? "text-gold-bright"
                : "text-[#fefefe]/60 hover:text-[#fefefe]"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg border border-[rgba(245,196,81,0.15)]"
                style={{ background: "rgba(91, 46, 255, 0.12)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="rounded-2xl bg-[#131318]/60 backdrop-blur-sm border border-white/[0.04] p-6 transition-shadow duration-500 focus-within:shadow-[0_0_30px_rgba(91,46,255,0.06)]">
        <AnimatePresence mode="wait">
          {activeTab === "describe" && (
            <motion.textarea
              key="describe"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. users drop off after signup and we don't know why"
              rows={4}
              aria-label="Describe your product situation"
              className="w-full bg-transparent text-[#fefefe] placeholder:text-[#fefefe]/30 resize-none outline-none font-body text-base leading-relaxed"
            />
          )}

          {activeTab === "url" && (
            <motion.input
              key="url"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://your-product.com/signup"
              aria-label="Paste your product URL"
              className="w-full bg-transparent text-[#fefefe] placeholder:text-[#fefefe]/30 outline-none font-body text-base py-3"
            />
          )}

          {activeTab === "screenshot" && (
            <motion.div
              key="screenshot"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              {screenshot ? (
                <div className="relative w-full">
                  <img
                    src={screenshot}
                    alt="Uploaded screenshot preview"
                    className="w-full max-h-48 object-contain rounded-lg opacity-80"
                  />
                  <button
                    onClick={handleClearScreenshot}
                    aria-label="Remove screenshot"
                    tabIndex={0}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-[#fefefe]/70 hover:text-[#fefefe] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={e =>
                    e.key === "Enter" && fileRef.current?.click()
                  }
                  aria-label="Upload a screenshot"
                  tabIndex={0}
                  className="w-full py-12 border-2 border-dashed border-white/[0.07] rounded-xl text-[#fefefe]/60 hover:border-gold-dim/30 hover:text-[#fefefe] transition-all cursor-pointer group"
                >
                  <div className="text-3xl mb-2 opacity-50 group-hover:opacity-70 transition-opacity">
                    ⬆
                  </div>
                  <div className="text-sm">Click to upload a screenshot</div>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <motion.button
        onClick={handleSubmit}
        disabled={!hasInput || processing}
        whileHover={
          hasInput && !processing
            ? {
                scale: 1.02,
                boxShadow: "0 0 40px rgba(245,196,81,0.18)",
              }
            : {}
        }
        whileTap={hasInput && !processing ? { scale: 0.98 } : {}}
        aria-label="Deal the cards"
        tabIndex={0}
        className={`
          mt-6 w-full py-4 rounded-xl font-title text-lg tracking-wider
          transition-all duration-500 cursor-pointer
          ${
            hasInput && !processing
              ? "bg-gradient-to-r from-[#B8942E] via-[#F5C451] to-[#B8942E] text-[#0B0B0F] shadow-[0_0_30px_rgba(245,196,81,0.1)]"
              : "bg-white/[0.04] text-[#fefefe]/40 cursor-not-allowed"
          }
        `}
      >
        <AnimatePresence mode="wait">
          {processing ? (
            <motion.span
              key="processing"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center gap-3"
            >
              <span className="inline-block w-4 h-4 border-2 border-[#fefefe]/40 border-t-[#fefefe] rounded-full animate-spin" />
              {processingMessage}
            </motion.span>
          ) : (
            <motion.span
              key="deal"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              → Deal the Cards
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

export default InputPanel

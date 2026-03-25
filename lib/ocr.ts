import Tesseract from "tesseract.js"

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "it", "this", "that", "are", "was",
  "be", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "can", "shall", "not", "no", "so",
  "if", "as", "up", "out", "all", "its", "my", "we", "our", "your",
  "you", "they", "them", "their", "he", "she", "his", "her", "www",
  "com", "http", "https", "org", "net", "io",
])

const isGarbage = (token: string): boolean => {
  if (token.length <= 1) return true
  const alphaCount = (token.match(/[a-zA-Z]/g) || []).length
  if (alphaCount / token.length < 0.5) return true
  if (/^[^a-zA-Z]+$/.test(token)) return true
  return false
}

export const cleanOcrText = (raw: string): string => {
  const lines = raw.split(/\n/)
  const cleaned: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const alphaChars = (trimmed.match(/[a-zA-Z]/g) || []).length
    if (alphaChars / Math.max(trimmed.length, 1) < 0.4) continue

    const words = trimmed.split(/\s+/).filter(w => !isGarbage(w))
    if (words.length > 0) {
      cleaned.push(words.join(" "))
    }
  }

  return cleaned.join(". ")
}

export const summarizeOcrText = (cleaned: string): string => {
  const words = cleaned
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))

  const freq = new Map<string, number>()
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1)
  }

  const topWords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word)

  if (topWords.length === 0) return "Uploaded screenshot"

  return `Screenshot showing: ${topWords.join(", ")}`
}

export const extractTextFromImage = async (imageData: string): Promise<{ matchText: string; displayText: string }> => {
  try {
    const { data: { text } } = await Tesseract.recognize(imageData, "eng", {
      logger: () => {},
    })

    const raw = text.trim()
    if (!raw || raw.length < 5) {
      return { matchText: "", displayText: "Uploaded screenshot" }
    }

    const cleaned = cleanOcrText(raw)
    const display = summarizeOcrText(cleaned)

    return { matchText: cleaned, displayText: display }
  } catch {
    return { matchText: "", displayText: "Uploaded screenshot" }
  }
}

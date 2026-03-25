import insightsData from "@/data/lenny_insights.json"
import type { CardData } from "./cards"

export type InsightQuote = {
  text: string
  source: string
}

type InsightsMap = Record<string, { quote: string; source: string }[]>

const insights: InsightsMap = insightsData

export const getQuoteForCard = (card: CardData): InsightQuote | null => {
  if (!card.themes || card.themes.length === 0) return null

  const theme = card.themes[Math.floor(Math.random() * card.themes.length)]
  const pool = insights[theme]
  if (!pool || pool.length === 0) return null

  const entry = pool[Math.floor(Math.random() * pool.length)]
  return {
    text: entry.quote,
    source: entry.source,
  }
}

export const VOICE_LINES = [
  "You already knew this, didn't you?",
  "The cards don't lie. Neither do your metrics.",
  "Sometimes the truth hides in plain sight.",
  "The deck has spoken.",
  "What you do next… that's up to you.",
  "Funny how the obvious is always the hardest to see.",
  "The real question is — will you act on it?",
]

export const getRandomVoiceLine = (): string => {
  return VOICE_LINES[Math.floor(Math.random() * VOICE_LINES.length)]
}

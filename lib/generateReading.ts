import { CARDS, type CardData } from "./cards"
import { getQuoteForCard, type InsightQuote } from "./quotes"

export type ReadingCard = CardData & {
  quote: InsightQuote | null
}

const PHRASE_WEIGHT = 4
const KEYWORD_WEIGHT = 2
const SYNONYM_WEIGHT = 1

const GENERAL_FALLBACK_IDS = ["bluff", "echo", "premature"]

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 1)

const scoreCard = (input: string, card: CardData): number => {
  const lower = input.toLowerCase()
  const words = tokenize(input)
  const wordSet = new Set(words)

  let score = 0

  for (const phrase of card.phrases) {
    if (lower.includes(phrase.toLowerCase())) {
      score += PHRASE_WEIGHT
    }
  }

  for (const keyword of card.keywords) {
    if (wordSet.has(keyword.toLowerCase())) {
      score += KEYWORD_WEIGHT
    }
  }

  for (const synonym of card.synonyms) {
    if (wordSet.has(synonym.toLowerCase())) {
      score += SYNONYM_WEIGHT
    }
  }

  return score
}

const pickDiverse = (scored: { card: CardData; score: number }[]): CardData[] => {
  const selected: CardData[] = []
  const usedThemes = new Set<string>()

  const pool = [...scored]

  while (selected.length < 3 && pool.length > 0) {
    let bestIdx = 0
    let bestScore = -1

    for (let i = 0; i < pool.length; i++) {
      const item = pool[i]
      const themeOverlap = item.card.themes.filter(t => usedThemes.has(t)).length
      const diversityBonus = themeOverlap === 0 ? 1 : 0
      const effectiveScore = item.score + diversityBonus

      if (effectiveScore > bestScore) {
        bestScore = effectiveScore
        bestIdx = i
      }
    }

    const pick = pool.splice(bestIdx, 1)[0]
    selected.push(pick.card)
    pick.card.themes.forEach(t => usedThemes.add(t))
  }

  return selected
}

export const generateReading = (input: string): ReadingCard[] => {
  if (!input || input.trim().length === 0) {
    const shuffled = [...CARDS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3).map(card => ({
      ...card,
      quote: getQuoteForCard(card),
    }))
  }

  const scored = CARDS.map(card => ({
    card,
    score: scoreCard(input, card),
  }))

  const hasAnyMatch = scored.some(s => s.score > 0)

  if (!hasAnyMatch) {
    const fallbackCards = CARDS.filter(c => GENERAL_FALLBACK_IDS.includes(c.id))
    const remaining = CARDS.filter(c => !GENERAL_FALLBACK_IDS.includes(c.id))
    remaining.sort(() => Math.random() - 0.5)
    const selected = [...fallbackCards.slice(0, 2), remaining[0]].sort(() => Math.random() - 0.5)

    return selected.map(card => ({
      ...card,
      quote: getQuoteForCard(card),
    }))
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return Math.random() - 0.5
  })

  const selected = pickDiverse(scored)

  selected.sort(() => Math.random() - 0.5)

  return selected.map(card => ({
    ...card,
    quote: getQuoteForCard(card),
  }))
}

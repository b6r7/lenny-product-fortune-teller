import { CARDS, type CardData } from "./cards"
import { getQuoteForCard, type InsightQuote } from "./quotes"

export type ReadingCard = CardData & {
  quote: InsightQuote | null
}

export const generateReading = (input: string): ReadingCard[] => {
  const normalizedInput = input.toLowerCase()

  const scored = CARDS.map(card => {
    const score = card.keywords.reduce((acc, keyword) => {
      return acc + (normalizedInput.includes(keyword) ? 1 : 0)
    }, 0)
    return { card, score }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return Math.random() - 0.5
  })

  const selected: CardData[] = []
  const matchingCards = scored.filter(s => s.score > 0)
  const nonMatchingCards = scored.filter(s => s.score === 0)

  nonMatchingCards.sort(() => Math.random() - 0.5)

  for (const item of matchingCards) {
    if (selected.length >= 3) break
    selected.push(item.card)
  }
  for (const item of nonMatchingCards) {
    if (selected.length >= 3) break
    selected.push(item.card)
  }

  selected.sort(() => Math.random() - 0.5)

  return selected.map(card => ({
    ...card,
    quote: getQuoteForCard(card),
  }))
}

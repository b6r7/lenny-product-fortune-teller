import { CARDS, type CardData } from "./cards"
import { getQuoteForCard, type InsightQuote } from "./quotes"

export type ReadingCard = CardData & {
  quote: InsightQuote | null
}

export type ReadingConfidence = "high" | "medium" | "low"

export type ReadingResult = {
  cards: ReadingCard[]
  confidence: ReadingConfidence
} | null

const PHRASE_WEIGHT = 4
const KEYWORD_WEIGHT = 2
const SYNONYM_WEIGHT = 1

const GENERAL_FALLBACK_IDS = ["bluff", "echo", "premature"]

const PRODUCT_SIGNALS = new Set([
  "user", "users", "product", "feature", "features", "onboarding", "churn",
  "retention", "growth", "metric", "metrics", "data", "conversion", "funnel",
  "signup", "activation", "pricing", "revenue", "customer", "customers",
  "feedback", "roadmap", "sprint", "ship", "deploy", "launch", "mvp",
  "strategy", "team", "priority", "priorities", "scale", "optimize",
  "dashboard", "analytics", "kpi", "engagement", "acquisition", "ltv",
  "arpu", "nps", "saas", "b2b", "b2c", "marketplace", "platform",
  "app", "website", "landing", "page", "flow", "experience", "ux",
  "design", "interface", "navigation", "button", "cta", "form",
  "checkout", "cart", "subscription", "trial", "freemium", "paywall",
  "notification", "email", "campaign", "segment", "cohort", "ab",
  "test", "experiment", "hypothesis", "iteration", "backlog", "debt",
  "bug", "error", "drop", "bounce", "session", "click", "scroll",
  "search", "filter", "sort", "settings", "profile", "account",
  "login", "register", "password", "integration", "api", "webhook",
  "pipeline", "infrastructure", "migration", "refactor", "legacy",
  "stakeholder", "alignment", "okr", "goal", "initiative", "project",
  "release", "version", "beta", "alpha", "prototype", "wireframe",
  "mockup", "spec", "requirement", "scope", "budget", "timeline",
  "competitor", "market", "positioning", "brand", "messaging",
  "target", "audience", "persona", "segment", "niche", "vertical",
  "enterprise", "startup", "founder", "ceo", "cto", "cpo", "pm",
  "engineer", "developer", "designer", "marketer", "sales",
  "support", "success", "hire", "hiring", "interview", "candidate",
  "performance", "review", "feedback", "survey", "research",
  "problem", "solution", "value", "proposition", "hypothesis",
  "validate", "invalidate", "pivot", "iterate", "build", "measure",
  "learn", "agile", "lean", "kanban", "scrum", "ceremony",
])

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 1)

const hasProductSignal = (words: string[]): boolean => {
  let signalCount = 0
  for (const word of words) {
    if (PRODUCT_SIGNALS.has(word)) signalCount++
    if (signalCount >= 1) return true
  }
  return false
}

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

const toConfidence = (totalScore: number): ReadingConfidence => {
  if (totalScore >= 8) return "high"
  if (totalScore >= 3) return "medium"
  return "low"
}

export const generateReading = (input: string): ReadingResult => {
  if (!input || input.trim().length === 0) return null

  const words = tokenize(input)

  if (words.length < 2) return null
  if (!hasProductSignal(words)) return null

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

    return {
      cards: selected.map(card => ({
        ...card,
        quote: getQuoteForCard(card),
      })),
      confidence: "low",
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return Math.random() - 0.5
  })

  const selected = pickDiverse(scored)
  const totalScore = scored
    .filter(s => selected.includes(s.card))
    .reduce((sum, s) => sum + s.score, 0)

  selected.sort(() => Math.random() - 0.5)

  return {
    cards: selected.map(card => ({
      ...card,
      quote: getQuoteForCard(card),
    })),
    confidence: toConfidence(totalScore),
  }
}

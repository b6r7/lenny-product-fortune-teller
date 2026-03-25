const extractFromPath = (url: string): string => {
  try {
    const parsed = new URL(url)
    const segments = parsed.pathname
      .split("/")
      .filter(Boolean)
      .map(s => s.replace(/[-_]/g, " "))
      .filter(s => s.length > 1 && !/^\d+$/.test(s))
    return [parsed.hostname.replace("www.", ""), ...segments].join(" ")
  } catch {
    return url
  }
}

export const extractContentFromUrl = async (url: string): Promise<string> => {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    if (!res.ok) return extractFromPath(url)

    const { contents } = await res.json()
    if (!contents) return extractFromPath(url)

    const doc = new DOMParser().parseFromString(contents, "text/html")

    const title = doc.querySelector("title")?.textContent?.trim() ?? ""
    const desc =
      doc
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
        ?.trim() ?? ""
    const ogDesc =
      doc
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content")
        ?.trim() ?? ""
    const headings = [...doc.querySelectorAll("h1, h2, h3")]
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .slice(0, 10)
      .join(". ")

    const combined = [title, desc || ogDesc, headings].filter(Boolean).join(". ")

    return combined || extractFromPath(url)
  } catch {
    return extractFromPath(url)
  }
}

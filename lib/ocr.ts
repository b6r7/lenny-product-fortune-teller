import Tesseract from "tesseract.js"

export const extractTextFromImage = async (imageData: string): Promise<string> => {
  try {
    const { data: { text } } = await Tesseract.recognize(imageData, "eng", {
      logger: () => {},
    })
    return text.trim()
  } catch {
    return ""
  }
}

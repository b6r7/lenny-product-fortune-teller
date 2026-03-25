import type { Metadata } from "next"
import { Cinzel, Cormorant_Garamond, Outfit } from "next/font/google"
import "./globals.css"
import MuteToggle from "@/components/MuteToggle"
import InfoToggle from "@/components/InfoToggle"
import Particles from "@/components/Particles"

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lenny the Fortune Teller",
  description:
    "Revealing the truth of your product. Describe your situation and Lenny will deal the cards.",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${outfit.variable}`}
    >
      <body className="grain min-h-screen">
        <Particles />
        <InfoToggle />
        <MuteToggle />
        {children}
      </body>
    </html>
  )
}

export default RootLayout

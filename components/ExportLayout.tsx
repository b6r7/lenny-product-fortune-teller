import { forwardRef } from "react"
import type { ReadingCard } from "@/lib/generateReading"
import ExportCard from "./ExportCard"

type ExportLayoutProps = {
  cards: ReadingCard[]
  userInput: string
  actionMode: boolean
}

const ExportLayout = forwardRef<HTMLDivElement, ExportLayoutProps>(
  ({ cards, userInput, actionMode }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: 1200,
          height: 1600,
          background: "radial-gradient(ellipse at 50% 15%, rgba(91,46,255,0.14) 0%, rgba(91,46,255,0.03) 40%, #0B0B0F 70%)",
          color: "#fefefe",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 64px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "var(--font-body), system-ui, sans-serif",
        }}
      >
        {/* Subtle noise grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            pointerEvents: "none",
          }}
        />

        {/* Top decorative line */}
        <div
          style={{
            width: 60,
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(245,196,81,0.4), transparent)",
            marginBottom: 32,
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(245, 196, 81, 0.5)",
              fontFamily: "var(--font-title), serif",
              marginBottom: 14,
            }}
          >
            ✦ Lenny the Fortune Teller ✦
          </p>
          <h1
            style={{
              fontSize: 36,
              fontFamily: "var(--font-title), serif",
              fontWeight: 400,
              letterSpacing: "0.04em",
              color: "#fefefe",
              lineHeight: 1.2,
            }}
          >
            The cards have spoken
          </h1>
        </div>

        {/* User input */}
        {userInput && (
          <div style={{ textAlign: "center", maxWidth: 600, marginBottom: 8 }}>
            <p
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: "rgba(254, 254, 254, 0.4)",
                lineHeight: 1.6,
              }}
            >
              &ldquo;{userInput}&rdquo;
            </p>
          </div>
        )}

        {/* Mode indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
            padding: "6px 16px",
            borderRadius: 999,
            border: actionMode
              ? "1px solid rgba(91,46,255,0.25)"
              : "1px solid rgba(245,196,81,0.15)",
            background: actionMode
              ? "rgba(91,46,255,0.06)"
              : "rgba(245,196,81,0.03)",
          }}
        >
          <span style={{ fontSize: 12 }}>{actionMode ? "🧠" : "🔮"}</span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              color: actionMode ? "rgba(167,139,250,0.7)" : "rgba(245,196,81,0.6)",
            }}
          >
            {actionMode ? "Actionable guidance" : "Mystical interpretation"}
          </span>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 28,
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          {cards.map(card => (
            <ExportCard key={card.id} card={card} actionMode={actionMode} />
          ))}
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245, 196, 81, 0.25)",
            fontFamily: "var(--font-title), serif",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          {actionMode
            ? "Now go do something about it."
            : "You knew at least one of these already."}
        </p>

        {/* Bottom decorative line */}
        <div
          style={{
            width: 60,
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(245,196,81,0.3), transparent)",
            marginTop: 4,
          }}
        />
      </div>
    )
  }
)

ExportLayout.displayName = "ExportLayout"

export default ExportLayout

import type { ReadingCard } from "@/lib/generateReading"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/lenny-product-fortune-teller" : ""

type ExportCardProps = {
  card: ReadingCard
  actionMode: boolean
}

const ExportCard = ({ card, actionMode }: ExportCardProps) => {
  const hasImage = !!card.image

  return (
    <div
      className="relative w-[320px] rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(245, 196, 81, 0.25)",
        background: "linear-gradient(to bottom, #141020, #0c0814)",
      }}
    >
      {/* Image */}
      {hasImage && (
        <div className="relative w-full h-[220px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}${card.image!}`}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "saturate(0.85) contrast(1.05)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(12,8,20,0.3) 0%, rgba(12,8,20,0.95) 90%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      )}

      {/* Fallback symbol bg */}
      {!hasImage && (
        <div
          className="relative w-full h-[220px] flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(91,46,255,0.12) 0%, transparent 60%)",
          }}
        >
          <span
            className="text-[5rem] select-none"
            style={{ color: "rgba(245, 196, 81, 0.1)" }}
          >
            {card.symbol}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="relative px-6 pb-7 -mt-4">
        <p
          className="text-[9px] uppercase font-sans font-medium mb-1.5"
          style={{
            letterSpacing: "0.2em",
            color: "rgba(245, 196, 81, 0.55)",
          }}
        >
          {card.tag}
        </p>

        <h3
          className="text-[20px] leading-snug mb-1"
          style={{
            fontFamily: "var(--font-title), serif",
            color: "#fefefe",
          }}
        >
          {card.title}
        </h3>

        <p
          className="text-[11px] mb-4"
          style={{
            fontFamily: "var(--font-body), sans-serif",
            color: actionMode ? "rgba(167, 139, 250, 0.7)" : "rgba(254, 254, 254, 0.45)",
            fontStyle: actionMode ? "normal" : "italic",
          }}
        >
          {actionMode ? card.actionTitle : card.subtitle}
        </p>

        {/* Divider */}
        <div
          className="w-full h-px mb-4"
          style={{
            background: "linear-gradient(to right, transparent, rgba(245,196,81,0.15), transparent)",
          }}
        />

        {!actionMode ? (
          <>
            <p
              className="text-[13px] leading-relaxed"
              style={{
                fontFamily: "var(--font-body), sans-serif",
                color: "rgba(254, 254, 254, 0.88)",
              }}
            >
              {card.description}
            </p>

            {card.quote && (
              <p
                className="mt-3 text-[11px] leading-relaxed"
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontStyle: "italic",
                  color: "rgba(254, 254, 254, 0.4)",
                }}
              >
                &ldquo;{card.quote.text}&rdquo;
              </p>
            )}
          </>
        ) : (
          <ul className="space-y-2">
            {card.actions.slice(0, 4).map((action, i) => (
              <li
                key={i}
                className="flex gap-2 text-[12px] leading-snug"
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  color: "rgba(254, 254, 254, 0.82)",
                }}
              >
                <span style={{ color: "rgba(245, 196, 81, 0.45)", flexShrink: 0 }}>•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ExportCard

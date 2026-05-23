import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE6_CONFIG } from "../pages/Templateconfig";
import { alignToFlex, alignToTextAlign } from "../utils/templateStyleUtils";

interface Template6Props {
  config?: TemplateConfig;
}

/* ── static demo data ─────────────────────────────────────── */
const DEMO_SECTIONS = [
  {
    title: "Appetizers",
    photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
    items: [
      { name: "Garlic Bread",   price: "₹ 120" },
      { name: "Chicken Wings",  price: "₹ 120" },
      { name: "Caesar Salad",   price: "₹ 120" },
    ],
  },
  {
    title: "Main Course",
    photo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80",
    items: [
      { name: "Grilled Chicken Pasta",     price: "₹ 120" },
      { name: "Beef Burger + Fries",       price: "₹ 120" },
      { name: "Teriyaki Salmon Rice Bowl", price: "₹ 120" },
    ],
  },
  {
    title: "Drinks",
    photo: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80",
    items: [
      { name: "Iced Lemon Tea",     price: "₹ 120" },
      { name: "Hot Cappuccino",     price: "₹ 120" },
      { name: "Fresh Orange Juice", price: "₹ 120" },
    ],
  },
];

/* ── fork & knife SVG ──────────────────────────────────────── */
const CutleryIcon: React.FC<{ size?: number; color?: string }> = ({ size = 26, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

/* ── decorative flourish ───────────────────────────────────── */
const Flourish: React.FC<{ color?: string; flip?: boolean }> = ({ color = "#d4a47a", flip = false }) => (
  <svg width="70" height="36" viewBox="0 0 70 36" fill="none"
    style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }} aria-hidden="true">
    <path d="M68 18 C55 2, 30 2, 10 12 C5 14, 2 16, 2 18"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M68 18 C55 34, 30 34, 10 24 C5 22, 2 20, 2 18"
      stroke={color} strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.5" />
    <circle cx="68" cy="18" r="2.5" fill={color} />
    <circle cx="2"  cy="18" r="1.5" fill={color} opacity="0.6" />
  </svg>
);

/* ── menu row ──────────────────────────────────────────────── */
const MenuRow: React.FC<{
  section: typeof DEMO_SECTIONS[0];
  bgColor: string;
  cardBg: string;
  labelBg: string;
  textColor: string;
  headingSize: number;
  itemSize: number;
  showPrice: boolean;
}> = ({ section, bgColor, cardBg, labelBg, textColor, headingSize, itemSize, showPrice }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: 0,
    background: cardBg, borderRadius: "18px", marginBottom: "16px",
    padding: "18px 20px 18px 0", position: "relative",
  }}>
    {/* Circular photo */}
    <div style={{ flex: "0 0 110px", position: "relative", marginLeft: "-8px" }}>
      <div style={{
        width: 110, height: 110, borderRadius: "50%",
        border: `4px solid white`, overflow: "hidden",
        boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
      }}>
        <img src={section.photo} alt={section.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>

    {/* Content */}
    <div style={{ flex: 1, paddingLeft: "12px" }}>
      <div style={{
        display: "inline-block", background: labelBg,
        borderRadius: "999px", padding: "5px 24px", marginBottom: "12px",
      }}>
        <span style={{
          fontSize: headingSize, fontWeight: 800, color: "#3d1020",
          fontFamily: "'Georgia', serif", letterSpacing: "0.5px",
        }}>{section.title}</span>
      </div>

      {section.items.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px",
        }}>
          <span style={{ fontSize: itemSize, color: textColor, whiteSpace: "nowrap" }}>{item.name}</span>
          <span style={{
            flex: 1, borderBottom: "1.5px dotted rgba(255,255,255,0.35)",
            minWidth: "20px", marginBottom: "3px",
          }} />
          {showPrice && (
            <span style={{ fontSize: itemSize, fontWeight: 600, color: textColor, whiteSpace: "nowrap" }}>
              {item.price}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 6 COMPONENT — Restaurant Admin
══════════════════════════════════════════════════════════════ */
const Template6: React.FC<Template6Props> = ({ config = DEFAULT_TEMPLATE6_CONFIG }) => {
  const bgColor      = config.backgroundColor;
  const accentColor  = config.accentColor;
  const primaryColor = config.primaryColor;
  const footer       = config.footer;
  const showPrice    = config.layout.showPriceTag;

  const headingSize  = config.menuSection?.typography?.headingFontSize ?? 16;
  const itemSize     = config.menuSection?.typography?.contentFontSize  ?? 13;
  const headerAlign  = config.headerSection?.alignment ?? "center";
  const titleSize    = config.headerSection?.typography?.headingFontSize ?? 52;
  const subtitleSize = config.headerSection?.typography?.contentFontSize ?? 28;
  const textColor    = "#ffffff";
  const flourishColor = accentColor;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Oswald:wght@700&family=Open+Sans:wght@400;600;700&display=swap');
        .t6ra-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .t6ra-root {
          width: 100%; max-width: 540px; margin: 0 auto;
          background-color: ${bgColor};
          display: flex; flex-direction: column;
          font-family: 'Open Sans', sans-serif;
          position: relative; min-height: 700px; overflow: hidden;
        }
      `}</style>

      <div className="t6ra-root">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: alignToFlex(headerAlign),
          textAlign: alignToTextAlign(headerAlign),
          padding: "28px 28px 16px", position: "relative",
        }}>
          {/* Cutlery icon */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: bgColor, border: "2.5px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "8px", boxShadow: "0 2px 12px rgba(0,0,0,0.3)", zIndex: 2,
          }}>
            <CutleryIcon size={26} color="#ffffff" />
          </div>

          {/* Flourishes + script */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
            <Flourish color={flourishColor} />
            <h1 style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: subtitleSize, fontWeight: 700,
              color: flourishColor, whiteSpace: "nowrap", lineHeight: 1.1,
            }}>Restaurant</h1>
            <Flourish color={flourishColor} flip />
          </div>

          {/* FOOD MENU big heading */}
          <div style={{
            fontFamily: "'Oswald', 'Impact', sans-serif",
            fontSize: titleSize, fontWeight: 700,
            color: "#ffffff", letterSpacing: "3px",
            textTransform: "uppercase", lineHeight: 1.05,
            textAlign: alignToTextAlign(headerAlign),
          }}>
            FOOD MENU
          </div>
        </div>

        {/* ── MENU SECTIONS ──────────────────────────────────── */}
        <div style={{ padding: "8px 20px 8px" }}>
          {DEMO_SECTIONS.map((section, i) => (
            <MenuRow
              key={i}
              section={section}
              bgColor={bgColor}
              cardBg={primaryColor}
              labelBg={accentColor}
              textColor={textColor}
              headingSize={headingSize}
              itemSize={itemSize}
              showPrice={showPrice}
            />
          ))}
        </div>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <div style={{
          marginTop: "auto",
          background: primaryColor,
          borderRadius: "0 0 18px 18px",
          padding: `${footer?.spacing ?? 28}px 28px`,
          display: "flex",
          flexDirection: "column",
          alignItems: alignToFlex(footer?.headingAlignment ?? "center"),
          textAlign: alignToTextAlign(footer?.headingAlignment ?? "center"),
          borderTop: "1px solid rgba(255,255,255,0.12)",
          gap: "6px",
        }}>
          {/* Restaurant name */}
          <div style={{
            fontFamily: "'Oswald', 'Impact', sans-serif",
            fontSize: footer?.headingFontSize ?? 22,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}>
            Restaurant
          </div>

          {/* Address */}
          <div style={{
            fontSize: footer?.addressFontSize ?? 13,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.6,
            marginBottom: "12px",
          }}>
            123 Anywhere St., Any City
            <br />
            +123-456-7890 • hello@restaurant.com
          </div>

          {/* Social icons */}
          <div style={{
            display: "flex",
            justifyContent: alignToFlex(footer?.iconsAlignment ?? "center"),
            gap: "12px",
          }}>
            {[
              { label: "Facebook", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
              { label: "Instagram", rect: true },
              { label: "Twitter", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
            ].map(({ label, d, rect }) => (
              <a key={label} href="#" aria-label={label} style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.10)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {rect ? (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </>
                  ) : (
                    <path d={d} />
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Template6;

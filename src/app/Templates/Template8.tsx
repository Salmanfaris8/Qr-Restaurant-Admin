import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE8_CONFIG } from "../pages/Templateconfig";

interface Template8Props {
  config?: TemplateConfig;
  restaurant?: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
    website?: string;
    socialLinks?: { facebook?: string; instagram?: string; twitter?: string; [key: string]: any };
    operatingHours?: unknown;
  };
  categories?: {
    id: string;
    name: string;
    order?: number;
    items?: {
      id: string;
      name: string;
      description?: string;
      price: string | number;
      image?: string;
      isVeg?: boolean;
    }[];
  }[];
}

/* ── helpers ── */
const toStr = (v: unknown, fallback = "") => (v == null ? fallback : String(v));

const resolveImg = (image?: string | null) => {
  if (!image || typeof image !== "string") return "";
  if (/^(https?:)?\/\//.test(image) || image.startsWith("data:") || image.startsWith("/")) return image;
  return `${(import.meta as any).env?.VITE_API_URL_IMG}/${image}`;
};

const formatPrice = (price: string | number) => {
  if (typeof price === "number") {
    return `₹${price.toFixed(0)}`;
  }
  const clean = toStr(price).trim();
  return clean;
};

/* ── fallback demo data ── */
const DEFAULT_RESTAURANT = {
  logo: "",
  name: "LICERIA & CO",
  address: "123 Anywhere St., Any City",
  phone: "+123 456 7890",
};

const DEFAULT_CATEGORIES = [
  {
    id: "c1",
    name: "MAKANAN",
    items: [
      {
        id: "1",
        name: "Avocado Toast",
        description: "Roti panggang dengan alpukat dan telur rebus lembut.",
        price: "₹100",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
      },
      {
        id: "2",
        name: "Beef Burger Deluxe",
        description: "Daging sapi tebal dengan keju leleh dan saus spesial.",
        price: "₹100",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      },
      {
        id: "3",
        name: "Chicken Creamy Pasta",
        description: "Pasta lembut dengan saus krim dan potongan ayam.",
        price: "₹100",
      },
      {
        id: "4",
        name: "Crispy Chicken Rice Bowl",
        description: "Nasi hangat dengan ayam renyah dan saus pedas manis.",
        price: "₹100",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      },
    ],
  },
  {
    id: "c2",
    name: "MINUMAN",
    items: [
      {
        id: "5",
        name: "Iced Caramel Macchiato",
        description: "Espresso lembut dengan karamel dan susu segar.",
        price: "₹100",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
      },
      {
        id: "6",
        name: "Chocolate Frappe",
        description: "Es blended cokelat kental dengan whipped cream.",
        price: "₹100",
      },
      {
        id: "7",
        name: "Matcha Latte",
        description: "Teh hijau premium dengan susu lembut.",
        price: "₹100",
      },
      {
        id: "8",
        name: "Strawberry Mojito",
        description: "Campuran stroberi segar dan mint yang menyegarkan.",
        price: "₹100",
      },
    ],
  },
];

/* ── Icons ── */
const CutleryIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7a2 2 0 002 2h4a2 2 0 002-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 00-5 5v6a2 2 0 002 2h3zm0 0v7" />
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const LocationIcon: React.FC = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 8 — Forest Green & Terracotta (Doc1 structure)
══════════════════════════════════════════════════════════════ */
const Template8: React.FC<Template8Props> = ({
  config = DEFAULT_TEMPLATE8_CONFIG,
  restaurant,
  categories,
}) => {
  const safeConfig: TemplateConfig = {
    ...DEFAULT_TEMPLATE8_CONFIG, ...config,
    spacing:       { ...DEFAULT_TEMPLATE8_CONFIG.spacing,       ...(config?.spacing       || {}) },
    layout:        { ...DEFAULT_TEMPLATE8_CONFIG.layout,        ...(config?.layout        || {}) },
    footer:        { ...DEFAULT_TEMPLATE8_CONFIG.footer!,       ...(config?.footer        || {}) },
    headerSection: {
      ...DEFAULT_TEMPLATE8_CONFIG.headerSection!,
      ...(config?.headerSection || {}),
      typography: { ...DEFAULT_TEMPLATE8_CONFIG.headerSection!.typography, ...(config?.headerSection?.typography || {}) },
    },
    menuSection: {
      ...DEFAULT_TEMPLATE8_CONFIG.menuSection!,
      ...(config?.menuSection || {}),
      layout:     { ...DEFAULT_TEMPLATE8_CONFIG.menuSection!.layout,     ...(config?.menuSection?.layout     || {}) },
      typography: { ...DEFAULT_TEMPLATE8_CONFIG.menuSection!.typography, ...(config?.menuSection?.typography || {}) },
    },
  };

  /* ── pull values from config ── */
  const bgColor      = safeConfig.backgroundColor   || "#faf3e0";  // Beige-cream
  const primaryColor = safeConfig.primaryColor      || "#1c4e3a";  // Forest Green (ribbon, badges, borders)
  const accentColor  = safeConfig.accentColor       || "#c05c38";  // Terracotta (right column)
  const showPrice    = safeConfig.layout.showPriceTag;
  const headingSize  = safeConfig.menuSection?.typography?.headingFontSize ?? 16;
  const itemSize     = safeConfig.menuSection?.typography?.contentFontSize  ?? 13;
  const titleSize    = safeConfig.headerSection?.typography?.headingFontSize ?? 50;

  /* text color on colored backgrounds */
  const LIGHT_TEXT = bgColor;    // cream — used on green/terracotta surfaces
  const DARK_TEXT  = "#1c4e3a"; // forest green — used on cream surface
  const MUTED_TEXT = "#4a6b5a"; // muted green

  const activeRestaurant = { ...DEFAULT_RESTAURANT, ...(restaurant || {}) };
  const activeCategories = categories?.length ? categories : DEFAULT_CATEGORIES;

  const logoSrc = activeRestaurant.logo ? resolveImg(activeRestaurant.logo) : "";

  const fbLink = activeRestaurant.socialLinks?.facebook  || "#";
  const igLink = activeRestaurant.socialLinks?.instagram || "#";
  const twLink = activeRestaurant.socialLinks?.twitter   || "#";

  /* 2 images per category for the right panel */
  const fallbackUrls = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
  ];
  let fallbackIdx = 0;
  const panelByCategory: { catId: string; images: { src: string; price: string | number }[] }[] =
    activeCategories.map(cat => {
      const imgs: { src: string; price: string | number }[] = [];
      (cat.items || []).forEach(item => {
        if (imgs.length < 2) {
          if (item.image) {
            imgs.push({ src: resolveImg(item.image)!, price: item.price });
          }
        }
      });
      /* fill up to 2 with fallbacks if category had fewer than 2 images */
      while (imgs.length < 2) {
        imgs.push({ src: fallbackUrls[fallbackIdx++ % fallbackUrls.length], price: "₹100" });
      }
      return { catId: cat.id, images: imgs };
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800;900&family=Outfit:wght@400;500;600;700&display=swap');

        .t8lg-root * { box-sizing: border-box; margin: 0; padding: 0; }

        /* full-height terracotta strip via background gradient on root */
        .t8lg-root {
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          font-family: 'Outfit', sans-serif;
          position: relative;
          background: linear-gradient(
            to right,
            ${bgColor} 0%,
            ${bgColor} calc(100% - clamp(110px, 32%, 165px)),
            ${primaryColor} calc(100% - clamp(110px, 32%, 165px)),
            ${primaryColor} 100%
          );
          overflow: hidden;
        }

        /* ribbon — forest green, full width, pointed bottom */
        .t8lg-ribbon {
          position: relative;
          background: ${accentColor};
          text-align: center;
          padding: 14px 60px 18px;
          clip-path: polygon(0 0, 100% 0, 100% 80%, 52% 100%, 48% 100%, 0 80%);
          z-index: 2;
          width: 100%;
        }

        .t8lg-body {
          display: flex;
          align-items: stretch;
        }

        /* left: cream, grows with content */
        .t8lg-left {
          flex: 1;
          background: ${bgColor};
          padding: 20px 16px 24px;
          min-width: 0;
        }

        /* right: transparent (terracotta comes from root gradient), fixed width */
        .t8lg-right {
          width: clamp(110px, 32%, 165px);
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          align-self: stretch;
        }

        /* images section — flex:1 pushes footer to bottom */
        .t8lg-right-images {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          padding: 24px 10px 16px;
          gap: 14px;
          width: 100%;
        }

        /* footer info — pinned to bottom of terracotta column */
        .t8lg-right-footer {
          width: 100%;
          padding: 12px 8px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .t8lg-footer-divider {
          width: 60%;
          height: 1px;
          background: rgba(250,243,224,0.3);
          margin: 2px 0;
        }

        .t8lg-footer-info-row {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 4px;
          width: 100%;
          padding: 0 4px;
          text-align: center;
        }

        .t8lg-footer-info-text {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(7px, 2vw, 9px);
          color: ${LIGHT_TEXT};
          opacity: 0.88;
          line-height: 1.4;
          word-break: break-word;
        }

        .t8lg-footer-icon {
          color: ${LIGHT_TEXT};
          opacity: 0.75;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .t8lg-social-row {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-top: 5px;
        }

        .t8lg-social-btn {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid rgba(250,243,224,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          flex-shrink: 0;
          background: transparent;
        }

        /* category badge — terracotta, parallelogram clip */
        .t8lg-cat-badge {
          display: inline-block;
          background: ${accentColor};
          color: ${LIGHT_TEXT};
          font-family: 'League Spartan', sans-serif;
          font-size: clamp(11px, 3vw, 14px);
          font-weight: 800;
          letter-spacing: 2px;
          padding: 6px 20px 6px 16px;
          margin-bottom: 14px;
          text-transform: uppercase;
          clip-path: polygon(0% 0%, 100% 0%, 92% 100%, 0% 100%);
        }

        .t8lg-item { margin-bottom: 10px; }

        .t8lg-item-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          padding-bottom: 2px;
        }

        .t8lg-item-name {
          font-family: 'League Spartan', sans-serif;
          font-size: clamp(12px, 3.2vw, ${headingSize}px);
          font-weight: 700;
          color: ${DARK_TEXT};
          flex: 1;
          line-height: 1.3;
          text-transform: uppercase;
        }

        .t8lg-item-dots {
          flex: 1;
          border-bottom: 2px solid ${primaryColor};
          opacity: 0.2;
          min-width: 10px;
        }

        .t8lg-item-price {
          font-family: 'League Spartan', sans-serif;
          font-size: clamp(12px, 3.2vw, ${headingSize}px);
          font-weight: 800;
          color: ${primaryColor};
          white-space: nowrap;
          flex-shrink: 0;
        }

        .t8lg-item-desc {
          font-size: clamp(8px, 2.2vw, ${itemSize}px);
          color: ${MUTED_TEXT};
          line-height: 1.5;
          margin-top: 3px;
        }

        /* circular food images */
        .t8lg-img-wrap {
          position: relative;
          width: clamp(78px, 22vw, 108px);
          height: clamp(78px, 22vw, 108px);
          flex-shrink: 0;
        }

        .t8lg-img-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .t8lg-img-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .t8lg-img-badge {
          position: absolute;
          top: -10px;
          right: -4px;
          background: ${accentColor};
          color: ${LIGHT_TEXT};
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: clamp(9px, 2.5vw, 12px);
          width: clamp(26px, 7.5vw, 36px);
          height: clamp(26px, 7.5vw, 36px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid ${bgColor};
          line-height: 1;
        }

        .t8lg-img-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 3px solid #ffffff;
        }

        @media (max-width: 400px) {
          .t8lg-left { padding: 16px 12px 20px; }
          .t8lg-right { width: 100px; }
          .t8lg-ribbon { padding: 12px 50px 16px; }
          .t8lg-root {
            background: linear-gradient(
              to right,
              ${bgColor} 0%, ${bgColor} calc(100% - 100px),
              ${primaryColor} calc(100% - 100px), ${primaryColor} 100%
            );
          }
        }
        @media (max-width: 340px) {
          .t8lg-right { width: 88px; }
          .t8lg-root {
            background: linear-gradient(
              to right,
              ${bgColor} 0%, ${bgColor} calc(100% - 88px),
              ${primaryColor} calc(100% - 88px), ${primaryColor} 100%
            );
          }
        }
      `}</style>

      <div className="t8lg-root">

        {/* ══ HEADER RIBBON ══ */}
        <div className="t8lg-ribbon">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", marginBottom: "4px",
          }}>
            {logoSrc ? (
              <img src={logoSrc} alt="logo" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <span style={{ color: LIGHT_TEXT, opacity: 0.9 }}><CutleryIcon /></span>
            )}
            <span style={{
              fontFamily: "'League Spartan', sans-serif",
              fontSize: "clamp(11px, 3.2vw, 14px)",
              fontWeight: 800,
              color: LIGHT_TEXT,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}>
              {toStr(activeRestaurant.name, "LICERIA & CO")}
            </span>
          </div>
          <div style={{
            fontFamily: "'League Spartan', sans-serif",
            fontSize: `clamp(36px, 11vw, ${titleSize}px)`,
            fontWeight: 900,
            color: LIGHT_TEXT,
            letterSpacing: "4px",
            lineHeight: 1,
            textTransform: "uppercase",
          }}>
            MENU
          </div>
        </div>

        {/* ══ TWO-COLUMN BODY ══ */}
        <div className="t8lg-body">

          {/* ── LEFT: menu text ── */}
          <div className="t8lg-left">
            {activeCategories.map((cat, ci) => (
              <div key={cat.id || ci} style={{ marginBottom: ci < activeCategories.length - 1 ? "20px" : 0 }}>
                <div className="t8lg-cat-badge">{toStr(cat.name, "Category")}</div>
                {(cat.items || []).map((item, ii) => (
                  <div key={item.id || ii} className="t8lg-item">
                    <div className="t8lg-item-row">
                      <span className="t8lg-item-name">{toStr(item.name, "Item")}</span>
                      <span className="t8lg-item-dots" />
                      {showPrice && (
                        <span className="t8lg-item-price">{formatPrice(item.price)}</span>
                      )}
                    </div>
                    {item.description && (
                      <div className="t8lg-item-desc">{item.description}</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ── RIGHT: images + footer info ── */}
          <div className="t8lg-right">

            {/* food images — 2 per category, grouped with divider */}
            <div className="t8lg-right-images">
              {panelByCategory.map((group, gi) => (
                <React.Fragment key={group.catId}>
                  {group.images.map((img, idx) => (
                    <div key={idx} className="t8lg-img-wrap">
                      <div className="t8lg-img-circle">
                        <img src={img.src} alt="" />
                      </div>
                      {showPrice && (
                        <div className="t8lg-img-badge">{formatPrice(img.price)}</div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* ── footer info — bottom of terracotta column ── */}
            <div className="t8lg-right-footer">

              <div style={{
                fontFamily: "'League Spartan', sans-serif",
                fontSize: "clamp(8px, 2.2vw, 11px)",
                fontWeight: 800,
                color: LIGHT_TEXT,
                letterSpacing: "1px",
                textAlign: "center",
                textTransform: "uppercase",
              }}>
                {toStr(activeRestaurant.name)}
              </div>

              {activeRestaurant.address && (
                <div className="t8lg-footer-info-row">
                  <span className="t8lg-footer-icon"><LocationIcon /></span>
                  <span className="t8lg-footer-info-text">{activeRestaurant.address}</span>
                </div>
              )}

              {activeRestaurant.phone && (
                <div className="t8lg-footer-info-row">
                  <span className="t8lg-footer-icon"><PhoneIcon /></span>
                  <span className="t8lg-footer-info-text">{activeRestaurant.phone}</span>
                </div>
              )}


              {/* social icons */}
              <div className="t8lg-social-row">
                {[
                  { label: "Facebook", link: fbLink, d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                  { label: "Instagram", link: igLink, rect: true },
                  { label: "Twitter",  link: twLink, d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                ].map(({ label, link, d, rect }: any) => (
                  <a key={label} href={link} target="_blank" rel="noopener noreferrer"
                    aria-label={label} className="t8lg-social-btn">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke={LIGHT_TEXT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        </div>
      </div>
    </>
  );
};

export default Template8;
import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE7_CONFIG } from "../pages/Templateconfig";

interface Template7Props {
  config?: TemplateConfig;
  restaurant?: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    website?: string;
  };
  categories?: {
    id: string;
    name: string;
    items?: {
      id: string;
      name: string;
      description?: string;
      price: string | number;
      image?: string;
    }[];
  }[];
}

const toStr = (v: unknown, fallback = "") => (v == null ? fallback : String(v));

const resolveImg = (image?: string | null) => {
  if (!image || typeof image !== "string") return "";
  if (/^(https?:)?\/\//.test(image) || image.startsWith("data:") || image.startsWith("/")) return image;
  return `${(import.meta as any).env?.VITE_API_URL_IMG}/${image}`;
};

const formatPrice = (price: string | number) =>
  typeof price === "number" ? `$${price.toFixed(2)}` : toStr(price);

const DEFAULT_RESTAURANT = {
  name: "Elegant Restaurant",
  phone: "+123 456 7890",
  address: "123 Main Street, City Center", // ✅ ADD THIS
};

const DEFAULT_CATEGORIES = [
  {
    id: "c1", name: "All Day Brunch",
    items: [
      { id: "1", name: "Sunny Morning Toast", description: "Sourdough with scrambled eggs, avocado & tomatoes.", price: "₹ 5.00", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80" },
      { id: "2", name: "Classic Breakfast Platter", description: "Eggs your way, grilled sausage & hashbrowns.", price: "₹ 7.00", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
      { id: "3", name: "Creamy Mushroom Bowl", description: "Garlic rice with mushrooms in creamy sauce.", price: "₹ 8.00" },
    ],
  },
  {
    id: "c2", name: "Sandwich & Wraps",
    items: [
      { id: "4", name: "BBQ Chicken Melt", description: "Grilled chicken with BBQ sauce on ciabatta.", price: "₹ 5.00", image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400&q=80" },
      { id: "5", name: "Tuna Mayo Wrap", description: "Tortilla wrap with tuna & homemade dressing.", price: "₹ 7.00" },
    ],
  },
  {
    id: "c3", name: "Comfort Plates",
    items: [
      { id: "6", name: "Creamy Chicken Pasta", description: "Fettuccine in white cream sauce with grilled chicken.", price: "₹ 5.00", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80" },
      { id: "7", name: "Spicy Rice Bowl", description: "Fried chicken bites over rice & fried shallots.", price: "₹ 5.00" },
    ],
  },
];

const PhoneIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const Template7: React.FC<Template7Props> = ({
  config = DEFAULT_TEMPLATE7_CONFIG,
  restaurant,
  categories,
}) => {
  const safeConfig: TemplateConfig = {
    ...DEFAULT_TEMPLATE7_CONFIG, ...config,
    spacing:       { ...DEFAULT_TEMPLATE7_CONFIG.spacing,       ...(config?.spacing       || {}) },
    layout:        { ...DEFAULT_TEMPLATE7_CONFIG.layout,        ...(config?.layout        || {}) },
    footer:        { ...DEFAULT_TEMPLATE7_CONFIG.footer!,       ...(config?.footer        || {}) },
    headerSection: {
      ...DEFAULT_TEMPLATE7_CONFIG.headerSection!,
      ...(config?.headerSection || {}),
      typography: { ...DEFAULT_TEMPLATE7_CONFIG.headerSection!.typography, ...(config?.headerSection?.typography || {}) },
    },
    menuSection: {
      ...DEFAULT_TEMPLATE7_CONFIG.menuSection!,
      ...(config?.menuSection || {}),
      layout:     { ...DEFAULT_TEMPLATE7_CONFIG.menuSection!.layout,     ...(config?.menuSection?.layout     || {}) },
      typography: { ...DEFAULT_TEMPLATE7_CONFIG.menuSection!.typography, ...(config?.menuSection?.typography || {}) },
    },
  };

  const bgColor      = safeConfig.backgroundColor;
  const primaryColor = safeConfig.primaryColor;
  const accentColor  = safeConfig.accentColor;
  const showPrice    = safeConfig.layout.showPriceTag;
  const headingSize  = safeConfig.menuSection?.typography?.headingFontSize ?? 15;
  const itemSize     = safeConfig.menuSection?.typography?.contentFontSize  ?? 12;
  const titleSize    = safeConfig.headerSection?.typography?.headingFontSize ?? 44;

  const activeRestaurant = { ...DEFAULT_RESTAURANT, ...(restaurant || {}) };
  const activeCategories = categories?.length ? categories : DEFAULT_CATEGORIES;

  const restaurantPhone   = toStr(activeRestaurant.phone,   DEFAULT_RESTAURANT.phone);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        .t7ra-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .t7ra-root {
          width: 100%; max-width: 520px; margin: 0 auto;
          background-color: ${bgColor};
          display: flex; flex-direction: column;
          font-family: 'Inter', sans-serif;
          min-height: 650px;
        }
      `}</style>

      <div className="t7ra-root">
        {/* HEADER */}
        <div
          style={{
            borderBottom: `2px solid ${primaryColor}`,
            padding: "28px 24px 20px",
            textAlign: "center",
          }}
        >
          {/* Restaurant Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {/* Restaurant Name */}
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: primaryColor,
                letterSpacing: "2px",
                margin: 0,
                textTransform: "uppercase",
                lineHeight: 1.2,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {toStr(activeRestaurant.name, "Restaurant")}
            </h1>

            {/* Decorative Line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "12px",
                width: "100%",
                maxWidth: "260px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  background: primaryColor,
                  opacity: 0.4,
                }}
              />

              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 2v7a2 2 0 002 2h4a2 2 0 002-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2a5 5 0 00-5 5v6a2 2 0 002 2h3zm0 0v7" />
                </svg>
              </div>

              <div
                style={{
                  flex: 1,
                  height: "2px",
                  background: primaryColor,
                  opacity: 0.4,
                }}
              />
            </div>
          </div>

          {/* Food Menu */}
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: titleSize,
              fontWeight: 700,
              color: primaryColor,
              lineHeight: 1.1,
            }}
          >
            Food Menu
          </h1>
        </div>

        {/* CATEGORIES */}
        <div style={{ padding: "20px 14px", flex: 1 }}>
          {activeCategories.map((cat, i) => {
            const allImages = (cat.items || []).filter(it => it.image).map(it => resolveImg(it.image));
            const textLeft = i % 2 === 0;

            const textCard = (
              <div style={{
                flex: 1,
                border: `1.5px solid ${primaryColor}`,
                borderRadius: "10px",
                padding: "12px 14px",
                background: bgColor,
                minHeight: "120px",
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: headingSize + 1, fontWeight: 800,
                  color: primaryColor, marginBottom: "8px",
                }}>{toStr(cat.name, "Category")}</div>

                {(cat.items || []).slice(0, 4).map((item, j) => (
                  <div key={item.id || j} style={{ marginBottom: "7px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                      <span style={{
                        fontSize: itemSize + 1, fontWeight: 600,
                        color: primaryColor,
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        whiteSpace: "nowrap",
                      }}>{toStr(item.name, "Item")}</span>
                      <span style={{
                        flex: 1, borderBottom: "1.5px dotted rgba(0,0,0,0.25)",
                        minWidth: "8px", marginBottom: "3px",
                      }} />
                      {showPrice && (
                        <span style={{
                          fontSize: itemSize + 1, fontWeight: 700,
                          color: primaryColor, whiteSpace: "nowrap",
                        }}>{formatPrice(item.price)}</span>
                      )}
                    </div>
                    {item.description && (
                      <div style={{
                        fontSize: itemSize - 1, color: accentColor,
                        lineHeight: 1.4, marginTop: "1px",
                      }}>{item.description}</div>
                    )}
                  </div>
                ))}
              </div>
            );

            const imagePanel = (
              <div style={{ flex: "0 0 130px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {allImages.length === 0 ? (
                  <div style={{ flex: 1, borderRadius: "10px", background: "rgba(0,0,0,0.08)", minHeight: "120px" }} />
                ) : (
                  allImages.slice(0, 2).map((src, idx) => (
                    <div key={idx} style={{
                      borderRadius: "10px", overflow: "hidden",
                      height: allImages.length === 1 ? "130px" : "62px",
                    }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  ))
                )}
              </div>
            );

            return (
              <div key={cat.id || i} style={{ display: "flex", alignItems: "stretch", gap: "8px", marginBottom: "12px" }}>
                {textLeft ? textCard : imagePanel}
                {textLeft ? imagePanel : textCard}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
          <div
            style={{
              borderTop: `2px solid ${primaryColor}`,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            {/* Restaurant Name */}
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: primaryColor,
              }}
            >
              {activeRestaurant.name}
            </div>

            {activeRestaurant.address && (
              <div
                style={{
                  color: accentColor,
                  fontSize: "13px",
                  lineHeight: 1.6,
                  maxWidth: "90%",
                  wordBreak: "break-word",
                  textAlign: "center",
                  opacity: 0.9,
                }}
              >
                {toStr(activeRestaurant.address, "").trim()}
              </div>
            )}

            {/* Phone */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: accentColor,
                fontSize: "13px",
              }}
            >
              <PhoneIcon size={14} />
              {restaurantPhone}
            </div>

            {/* Social Icons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "8px" }}>
            {[
              { label: "Facebook", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
              { label: "Instagram", rect: true },
              { label: "Twitter", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
            ].map(({ label, d, rect }) => (
              <a key={label} href="#" aria-label={label} style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "transparent",
                border: `1px solid ${primaryColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default Template7;

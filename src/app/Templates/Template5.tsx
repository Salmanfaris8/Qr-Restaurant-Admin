import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE5_CONFIG } from "../pages/Templateconfig";
import { alignToFlex, alignToTextAlign } from "../utils/templateStyleUtils";
import { Phone, Globe, Facebook, Instagram, Twitter } from "lucide-react";

interface Template5Props {
  config?: TemplateConfig;
}

/* ─── static demo data ─────────────────────────────────────── */
const noodles = [
  { name: "Egg Noodles",     price: "$5.00" },
  { name: "Rice Noodles",    price: "$7.00" },
  { name: "Carrot Noodles",  price: "$6.50" },
  { name: "Garlic Noodles",  price: "$4.00" },
  { name: "Butter Noodles",  price: "$5.50" },
  { name: "Chicken Noodles", price: "$6.50" },
];

const burgers = [
  { name: "Butter Burger", price: "$6.00" },
  { name: "Beef Burger",   price: "$7.00" },
  { name: "Fruit Burger",  price: "$6.50" },
  { name: "Lamb Burger",   price: "$8.00" },
  { name: "Cheese Burger", price: "$5.50" },
  { name: "Butter Burger", price: "$6.50" },
];

const pizzas = [
  { name: "Onion Pizza",   price: "$5.00" },
  { name: "Beef Pizza",    price: "$7.00" },
  { name: "Egg Pizza",     price: "$6.50" },
  { name: "Apple Pizza",   price: "$4.00" },
  { name: "Cheese Pizza",  price: "$5.50" },
  { name: "Chicken Pizza", price: "$6.50" },
];

const iceCream = [
  { name: "Cookie Dough",   price: "$6.00" },
  { name: "Vanilla Bean",   price: "$7.00" },
  { name: "Cotton Candy",   price: "$6.50" },
  { name: "Peanut Butter",  price: "$8.00" },
  { name: "Apple Treat",    price: "$5.50" },
  { name: "Honey Treat",    price: "$6.50" },
];

/* ─── SVG mandala (simplified decorative element) ──────────── */
const MandalaCorner: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 120,
  color = "#b8860b",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    style={{ display: "block", opacity: 0.75, ...style }}
    aria-hidden="true"
  >
    <g fill="none" stroke={color} strokeWidth="1.2">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="60" cy="60" rx="52" ry="14" transform={`rotate(${deg} 60 60)`} />
      ))}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <ellipse key={`m${deg}`} cx="60" cy="60" rx="36" ry="9" transform={`rotate(${deg} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="22" />
      <circle cx="60" cy="60" r="14" />
      <circle cx="60" cy="60" r="6" />
      {[0, 45, 90, 135].map((deg) => (
        <line key={`l${deg}`} x1="60" y1="8" x2="60" y2="112" transform={`rotate(${deg} 60 60)`} />
      ))}
    </g>
    <circle cx="60" cy="60" r="4" fill={color} opacity="0.6" />
  </svg>
);

/* ─── ornate arch-top panel border SVG ─────────────────────── */
const OrnateFrame: React.FC<{ accentColor: string }> = ({ accentColor }) => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    viewBox="0 0 300 500"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d="M30,80 Q150,0 270,80" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
    <path d="M30,420 Q150,500 270,420" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
    {[
      "M20,20 L50,20 L20,50",
      "M280,20 L250,20 L280,50",
      "M20,480 L50,480 L20,450",
      "M280,480 L250,480 L280,450",
    ].map((d, i) => (
      <path key={i} d={d} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.55" />
    ))}
    <path d="M0,250 Q15,240 0,230" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.4" />
    <path d="M300,250 Q285,240 300,230" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.4" />
  </svg>
);

/* ─── menu item row ─────────────────────────────────────────── */
const ItemRow: React.FC<{
  name: string; price: string; nameFontSize: number;
  priceFontSize: number; textColor: string; showPrice: boolean;
}> = ({ name, price, nameFontSize, priceFontSize, textColor, showPrice }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "6px", padding: "3px 0" }}>
    <span style={{ fontSize: nameFontSize, color: textColor, fontFamily: "inherit" }}>{name}</span>
    {showPrice && (
      <span style={{ fontSize: priceFontSize, fontWeight: 600, color: textColor, whiteSpace: "nowrap", fontFamily: "inherit" }}>
        {price}
      </span>
    )}
  </div>
);

/* ─── menu section block ────────────────────────────────────── */
const MenuSection: React.FC<{
  title: string; items: { name: string; price: string }[];
  accentColor: string; textColor: string; headingSize: number; itemSize: number; showPrice: boolean;
}> = ({ title, items, accentColor, textColor, headingSize, itemSize, showPrice }) => (
  <div style={{ marginBottom: "18px" }}>
    <div style={{ borderTop: `1.5px dotted ${accentColor}88`, marginBottom: "6px" }} />
    <h2 style={{
      fontSize: headingSize, fontWeight: 900, textAlign: "center", letterSpacing: "2px",
      textTransform: "uppercase", color: textColor, marginBottom: "4px",
      fontFamily: "'Playfair Display', 'Georgia', serif",
    }}>
      {title}
    </h2>
    <div style={{ borderTop: `1.5px dotted ${accentColor}88`, marginBottom: "10px" }} />
    <div>
      {items.map((item, i) => (
        <ItemRow key={i} name={item.name} price={item.price}
          nameFontSize={itemSize} priceFontSize={itemSize}
          textColor={textColor} showPrice={showPrice} />
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 5 COMPONENT
══════════════════════════════════════════════════════════════ */
const Template5: React.FC<Template5Props> = ({ config = DEFAULT_TEMPLATE5_CONFIG }) => {
  const bgColor      = config.backgroundColor;
  const accentColor  = config.accentColor;
  const primaryColor = config.primaryColor;
  const footer       = config.footer;
  const showPrice    = config.layout.showPriceTag;
  const headingSize  = config.menuSection?.typography?.headingFontSize ?? 15;
  const itemSize     = config.menuSection?.typography?.contentFontSize  ?? 13;
  const textColor    = "#3a2700";

  const headerAlign  = config.headerSection?.alignment ?? "center";

  const panelStyle: React.CSSProperties = {
    position: "relative", background: primaryColor, borderRadius: "18px",
    flex: 1, minWidth: 0, padding: "28px 22px 22px", overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .t5-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .t5-root {
          width: 100%; max-width: 860px; margin: 0 auto;
          background-color: ${bgColor}; display: flex; flex-direction: column;
          font-family: 'DM Sans', sans-serif; position: relative; min-height: 560px;
        }
        .t5-corner-tl { position: absolute; top: -18px; left: -18px; }
        .t5-corner-tr { position: absolute; top: -18px; right: -18px; transform: scaleX(-1); }
        .t5-corner-bl { position: absolute; bottom: -18px; left: -18px; transform: scaleY(-1); }
        .t5-corner-br { position: absolute; bottom: -18px; right: -18px; transform: scale(-1); }
        .t5-panels {
          display: flex; flex-direction: row; gap: 14px;
          padding: 32px 28px; position: relative; z-index: 2;
        }
        .t5-left-panel { flex: 0 0 220px; min-width: 0; }
        .t5-hotel-name {
          font-family: 'Playfair Display', serif;
          font-size: ${config.headerSection?.typography?.headingFontSize ?? 36}px;
          font-weight: 900; color: ${textColor}; line-height: 1.0;
          letter-spacing: 2px; text-align: ${alignToTextAlign(headerAlign)}; margin-bottom: 2px;
        }
        .t5-hotel-sub {
          font-family: 'Playfair Display', serif;
          font-size: ${config.headerSection?.typography?.contentFontSize ?? 14}px;
          font-weight: 700; color: ${textColor}; text-align: ${alignToTextAlign(headerAlign)};
          letter-spacing: 3px; margin-bottom: 10px; opacity: 0.8;
        }
        .t5-divider-dots { border-top: 1.5px dotted ${accentColor}88; margin: 8px 0; }
        .t5-contact-row {
          display: flex; align-items: center; gap: 8px; font-size: 12px;
          color: ${textColor}; opacity: 0.8; margin: 4px 0; justify-content: ${alignToFlex(headerAlign)};
        }
        .t5-food-img-wrap { position: relative; width: 130px; height: 130px; margin: 14px ${headerAlign === "start" ? "0" : headerAlign === "end" ? "0 0 0 auto" : "auto"} 8px; }
        .t5-food-img {
          width: 130px; height: 130px; border-radius: 50%; object-fit: cover;
          border: 4px solid ${accentColor}66; display: block; position: relative; z-index: 1;
        }
        .t5-mandala-behind {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%); z-index: 0; pointer-events: none;
        }
        .t5-spice-row { display: flex; justify-content: ${alignToFlex(headerAlign)}; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
        .t5-spice-img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid ${accentColor}44; }
        .t5-footer {
          border-top: 1.5px solid ${accentColor}55; padding: 10px 28px;
          display: flex; flex-direction: column; align-items: ${alignToFlex(footer?.headingAlignment ?? "center")};
          gap: 5px; position: relative; z-index: 2;
        }
        .t5-footer-title {
          font-family: 'Playfair Display', serif;
          font-size: ${footer?.headingFontSize ?? 14}px; font-weight: 700; color: ${textColor}; opacity: 0.85;
          text-align: ${alignToTextAlign(footer?.headingAlignment ?? "center")};
        }
        .t5-footer-addr { font-size: ${footer?.addressFontSize ?? 11}px; color: ${textColor}; opacity: 0.70; text-align: ${alignToTextAlign(footer?.addressAlignment ?? "center")}; }
        .t5-social-btn {
            background: ${accentColor}22;
            border: 1px solid ${accentColor}55;
            cursor: pointer;
            color: ${textColor};
            opacity: 0.70;
            display: flex;
            align-items: center;
            padding: 8px;
            border-radius: 50%;
          }
        .t5-social-btn:hover { opacity: 1; }
        @media (max-width: 600px) {
          .t5-panels { flex-direction: column; padding: 18px 14px; }
          .t5-left-panel { flex: none; }
          .t5-hotel-name { font-size: 28px; }
        }
      `}</style>

      <div className="t5-root">
        <div className="t5-corner-tl" aria-hidden="true"><MandalaCorner size={130} color={accentColor} /></div>
        <div className="t5-corner-tr" aria-hidden="true"><MandalaCorner size={130} color={accentColor} /></div>
        <div className="t5-corner-bl" aria-hidden="true"><MandalaCorner size={130} color={accentColor} /></div>
        <div className="t5-corner-br" aria-hidden="true"><MandalaCorner size={130} color={accentColor} /></div>

        <div className="t5-panels">
          {/* LEFT: Branding */}
          <div style={{ ...panelStyle }} className="t5-left-panel">
            <OrnateFrame accentColor={accentColor} />
            <h1 className="t5-hotel-name">FAUGET</h1>
            <div className="t5-hotel-sub">HOTEL</div>
            <div className="t5-divider-dots" />
            <div className="t5-contact-row"><Phone size={11} /><span>+123-456-7890</span></div>
            <div className="t5-contact-row"><Globe size={11} /><span>www.reallygreatsite.com</span></div>
            <div className="t5-food-img-wrap">
              <div className="t5-mandala-behind"><MandalaCorner size={150} color={accentColor} /></div>
              <img className="t5-food-img"
                src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-restaurant-logo-design-vector-template-png-image_5441058.jpg"
                alt="Featured dish" />
            </div>
            <div className="t5-spice-row">
              <img className="t5-spice-img" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80" alt="dish 1" />
              <img className="t5-spice-img" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" alt="dish 2" />
              <img className="t5-spice-img" src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80" alt="dish 3" />
            </div>
          </div>

          {/* MIDDLE: Noodles + Burger */}
          <div style={panelStyle}>
            <OrnateFrame accentColor={accentColor} />
            <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
              <MenuSection title="Noodles" items={noodles} accentColor={accentColor} textColor={textColor} headingSize={headingSize} itemSize={itemSize} showPrice={showPrice} />
              <MenuSection title="Burger"  items={burgers} accentColor={accentColor} textColor={textColor} headingSize={headingSize} itemSize={itemSize} showPrice={showPrice} />
            </div>
          </div>

          {/* RIGHT: Pizza + Ice Cream */}
          <div style={panelStyle}>
            <OrnateFrame accentColor={accentColor} />
            <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
              <MenuSection title="Pizza"     items={pizzas}   accentColor={accentColor} textColor={textColor} headingSize={headingSize} itemSize={itemSize} showPrice={showPrice} />
              <MenuSection title="Ice Cream" items={iceCream} accentColor={accentColor} textColor={textColor} headingSize={headingSize} itemSize={itemSize} showPrice={showPrice} />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="t5-footer">
          <span className="t5-footer-title">Fauget Hotel</span>
          <span className="t5-footer-addr">123 Anywhere St, Any City</span>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="t5-social-btn" aria-label="Facebook"><Facebook size={20} /></button>
            <button className="t5-social-btn" aria-label="Instagram"><Instagram size={20} /></button>
            <button className="t5-social-btn" aria-label="Twitter"><Twitter size={20} /></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Template5;

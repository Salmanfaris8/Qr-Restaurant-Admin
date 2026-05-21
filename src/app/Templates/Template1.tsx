import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE1_CONFIG } from "../pages/Templateconfig";
import { alignToFlex, alignToTextAlign } from "../utils/templateStyleUtils";

interface Template1Props {
  config?: TemplateConfig;
}

const mainCourse1 = [
  { name: "Classic Beef Burger", price: "₹ 9.00", isVeg: false },
  { name: "Paneer Butter Masala", price: "₹ 8.50", isVeg: true },
  { name: "Fish and Chips", price: "₹ 10.00", isVeg: false },
  { name: "BBQ Ribs Half Rack", price: "₹ 13.00", isVeg: false },
];

const mainCourse2 = [
  { name: "Classic Beef Burger", price: "₹ 9.00", isVeg: false },
  { name: "Paneer Butter Masala", price: "₹ 8.50", isVeg: true },
  { name: "Fish and Chips", price: "₹ 10.00", isVeg: false },
  { name: "BBQ Ribs Half Rack", price: "₹ 13.00", isVeg: false },
];

const Template1: React.FC<Template1Props> = ({ config = DEFAULT_TEMPLATE1_CONFIG }) => {
  const headerAlign = config.headerSection?.alignment ?? "start";
  const menuLayout = config.menuSection?.layout;
  const menuTypography = config.menuSection?.typography;
  const footer = config.footer;
  const menuColumns = Math.min(3, Math.max(1, config.layout.menuColumns));
  const swapColumns = menuLayout?.contentPosition === "right";
  const showPrice = config.layout.showPriceTag;
  const showDividers = config.layout.showDividers;

  const VegIcon = ({ isVeg }: { isVeg?: boolean }) => {
  if (typeof isVeg !== "boolean") return null;

  return (
    <span
      style={{
        width: "15px",
        height: "15px",
        border: `1.5px solid ${isVeg ? "#4caf50" : "#f44336"}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "6px",
        flexShrink: 0,
        background: "white"
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          background: isVeg ? "#4caf50" : "#f44336",
          borderRadius: "50%",
        }}
      />
    </span>
  );
};

  const leftColumn = (
    <>
      <div className="t1-card">
        <div className="t1-card-title">MAIN COURSE</div>
        {mainCourse1.map((item, index) => (
          <div className="t1-menu-item" key={index}>
            <span className="t1-item-name" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <VegIcon isVeg={item.isVeg} />
              {item.name}
            </span>
            {showPrice && <span className="t1-item-price">{item.price}</span>}
          </div>
        ))}
      </div>
      <div className="t1-image-wrapper" style={{ height: "250px" }}>
        <img
          src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Drink"
        />
      </div>
    </>
  );

  const rightColumn = (
    <>
      <div className="t1-image-wrapper" style={{ height: "250px" }}>
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Bowl"
        />
      </div>
      <div className="t1-card">
        <div className="t1-card-title">MAIN COURSE</div>
        {mainCourse2.map((item, index) => (
          <div className="t1-menu-item" key={index}>
            <span className="t1-item-name" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <VegIcon isVeg={item.isVeg} />
              {item.name}
            </span>
            {showPrice && <span className="t1-item-price">{item.price}</span>}
          </div>
        ))}
      </div>
    </>
  );

  return (
    
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Poppins:wght@400;500;600;700&display=swap');
          
          .template1-wrapper * { box-sizing: border-box; }
          
          .template1-wrapper {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background-color: ${config.backgroundColor};
            position: relative;
            overflow: hidden;
            padding: 40px;
            font-family: 'Poppins', sans-serif;
            color: #1a1a1a;
          }

          .t1-bg-shape-1 {
            position: absolute;
            top: 0;
            right: 0;
            width: 350px;
            height: 350px;
            background-color: ${adjustColor(config.backgroundColor, -20)};
            border-bottom-left-radius: 100%;
            z-index: 0;
          }

          .t1-bg-shape-2 {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 250px;
            height: 250px;
            background-color: ${adjustColor(config.backgroundColor, -20)};
            border-top-right-radius: 100%;
            z-index: 0;
          }

          .t1-content-wrapper { position: relative; z-index: 1; }

          .t1-header {
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-items: ${alignToFlex(headerAlign)};
            text-align: ${alignToTextAlign(headerAlign)};
          }

          .t1-pill {
            background-color: ${config.primaryColor};
            color: white;
            display: inline-flex;
            align-items: center;
            padding: 8px 20px;
            border-radius: 50px;
            font-weight: ${config.headerSection?.typography?.contentFontWeight ?? 500};
            font-size: ${config.headerSection?.typography?.contentFontSize ?? 18}px;
            gap: 10px;
          }

          .t1-pill svg { width: 20px; height: 20px; }

          .t1-title {
            font-family: 'Montserrat', sans-serif;
            font-size: ${config.headerSection?.typography?.headingFontSize ?? 85}px;
            font-weight: ${config.headerSection?.typography?.headingFontWeight ?? 900};
            color: #151624;
            margin: 15px 0 0 0;
            line-height: 1;
            letter-spacing: 1px;
            width: 100%;
          }

          .t1-grid-container {
            display: grid;
            grid-template-columns: repeat(${menuColumns}, 1fr);
            gap: ${menuLayout?.gap ?? config.spacing.cardGap}px;
            margin-top: 30px;
          }

          .t1-card {
            background-color: ${config.primaryColor};
            border-radius: 24px;
            padding: 30px 24px;
            color: white;
            text-align: ${alignToTextAlign(menuLayout?.contentAlignment ?? "start")};
          }

          .t1-card-title {
            font-size: ${menuTypography?.headingFontSize ?? 26}px;
            font-weight: ${menuTypography?.headingFontWeight ?? 700};
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: ${showDividers ? "1px solid rgba(255, 255, 255, 0.4)" : "none"};
            padding-bottom: 12px;
            display: block;
            width: 100%;
            text-align: ${alignToTextAlign(menuLayout?.headerAlignment ?? "start")};
          }

          .t1-menu-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: ${menuTypography?.contentFontSize ?? 15}px;
            font-weight: ${menuTypography?.contentFontWeight ?? 400};
          }

          .t1-menu-item:last-child { margin-bottom: 0; }

          .t1-item-name { font-weight: 400; color: #f0f0f0; }
          .t1-item-price { font-weight: 600; color: ${config.accentColor}; }

          .t1-image-wrapper { border-radius: 24px; overflow: hidden; width: 100%; }
          .t1-image-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; }

          .t1-left-column,
          .t1-right-column {
            display: flex;
            flex-direction: column;
            gap: ${menuLayout?.gap ?? config.spacing.cardGap}px;
          }

          @media (max-width: 600px) {
            .t1-grid-container { grid-template-columns: 1fr; }
            .t1-title {
              font-size: ${Math.min(config.headerSection?.typography?.headingFontSize ?? 85, 55)}px;
            }
            .template1-wrapper { padding: 20px; }
          }

          .t1-footer {
            margin-top: ${config.spacing.sectionSpacing}px;
            background-color: ${config.primaryColor};
            border-radius: 24px;
            padding: ${footer?.spacing ?? 40}px;
            color: white;
          }

          .t1-footer-title {
            font-family: 'Montserrat', sans-serif;
            font-size: ${footer?.headingFontSize ?? 24}px;
            font-weight: 800;
            margin-bottom: 10px;
            letter-spacing: 1px;
            text-align: ${alignToTextAlign(footer?.headingAlignment ?? "center")};
          }

          .t1-footer-address {
            font-size: ${footer?.addressFontSize ?? 15}px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 24px;
            line-height: 1.6;
            text-align: ${alignToTextAlign(footer?.addressAlignment ?? "center")};
          }

          .t1-social-links {
            display: flex;
            justify-content: ${alignToFlex(footer?.iconsAlignment ?? "center")};
            gap: 16px;
          }

          .t1-social-icon {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            text-decoration: none;
          }

          .t1-social-icon svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: white;
            stroke-width: 2;
          }
        `}
      </style>
      <div className="template1-wrapper">
        <div className="t1-bg-shape-1" />
        <div className="t1-bg-shape-2" />

        <div style={{ position: "absolute", top: "240px", left: "25px", fontSize: "28px", zIndex: 2, transform: "rotate(-20deg)" }}>🍅</div>
        <div style={{ position: "absolute", bottom: "260px", right: "15px", fontSize: "28px", zIndex: 2 }}>🍅</div>
        <div style={{ position: "absolute", top: "10px", right: "60px", fontSize: "45px", zIndex: 2, transform: "rotate(45deg)" }}>🍃</div>
        <div style={{ position: "absolute", bottom: "40px", left: "10px", fontSize: "50px", zIndex: 2, transform: "rotate(-30deg)" }}>🍃</div>
        <div style={{ position: "absolute", bottom: "10px", right: "120px", fontSize: "35px", zIndex: 2, transform: "rotate(15deg)" }}>🍃</div>

        <div className="t1-content-wrapper">
          <div className="t1-header">
            <div className="t1-pill">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7L7 17L12 9L17 17L21 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Wardiere Restaurant
            </div>
            <h1 className="t1-title">FOOD MENU</h1>
          </div>

          <div className="t1-grid-container">
            <div className={swapColumns ? "t1-right-column" : "t1-left-column"}>
              {swapColumns ? rightColumn : leftColumn}
            </div>
            {menuColumns >= 2 && (
              <div className={swapColumns ? "t1-left-column" : "t1-right-column"}>
                {swapColumns ? leftColumn : rightColumn}
              </div>
            )}
          </div>

          <div className="t1-footer">
            <div className="t1-footer-title">Wardiere Restaurant</div>
            <div className="t1-footer-address">
              123 Culinary Boulevard, Foodville, NY 10001
              <br />
              +1 (555) 123-4567 • hello@wardiererestaurant.com
            </div>
            <div className="t1-social-links">
              <a href="#" className="t1-social-icon" aria-label="Facebook">
                <svg viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" className="t1-social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="t1-social-icon" aria-label="Twitter">
                <svg viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function adjustColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return (
    "#" +
    (0x1000000 + (R < 16 ? 0 : 1) * R * 0x10000 + (G < 16 ? 0 : 1) * G * 0x100 + (B < 16 ? 0 : 1) * B)
      .toString(16)
      .slice(1)
  );
}

export default Template1;

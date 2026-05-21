import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE4_CONFIG } from "../pages/Templateconfig";
import { alignToFlex, alignToTextAlign } from "../utils/templateStyleUtils";
import { Facebook, Instagram, Twitter, MapPin, Phone } from "lucide-react";

interface Template4Props {
  config?: TemplateConfig;
}

const appetizersAndSnacks = [
  {
    name: "Mozzarella Sticks",
    price: "₹ 7",
    isVeg: true,
    description: "Crispy fried cheese sticks served with dip",
  },
  {
    name: "French Fries",
    price: "₹ 6",
    isVeg: true,
    description: "Golden crispy potato fries",
  },
  {
    name: "Chicken Fingers",
    price: "₹ 6",
    isVeg: false,
    description: "Juicy chicken strips coated in breadcrumbs",
  },
];

const gourmetBurgers = [
  { name: "Bacon Cheeseburger", price: "₹ 5", isVeg: false, description: "Beef patty with bacon and cheese" },
  { name: "Stroganoff", price: "₹ 8", isVeg: false, description: "Creamy beef stroganoff burger" },
  { name: "Vegetable Chilli", price: "₹ 6", isVeg: true, description: "Spicy vegetable mix burger" },
  { name: "Four Cheese", price: "₹ 9", isVeg: true, description: "Loaded with four types of cheese" },
  { name: "Quarter Pounder with Cheese", price: "₹ 5", isVeg: false, description: "Classic beef burger with cheese" },
  { name: "Mushroom Swiss", price: "₹ 7", isVeg: true, description: "Mushroom and Swiss cheese burger" },
];

const burgerToppings = [
  { name: "Bacon Bits", price: "₹ 4", isVeg: false, description: "Crispy bacon topping" },
  { name: "Cream Cheese", price: "₹ 4", isVeg: true, description: "Soft creamy cheese spread" },
  { name: "Roasted Red Pepper", price: "₹ 3", isVeg: true, description: "Sweet roasted peppers" },
  { name: "Caramelized Onions", price: "₹ 3", isVeg: true, description: "Slow-cooked sweet onions" },
  { name: "Aioli Sauce", price: "₹ 4", isVeg: true, description: "Garlic mayonnaise sauce" },
  { name: "Cranberry Sauce", price: "₹ 3", isVeg: true, description: "Sweet tangy cranberry sauce" },
  { name: "Sour Cream", price: "₹ 3", isVeg: true, description: "Fresh creamy topping" },
];

const milkshakesAndSundaes = [
  { name: "Hot Fudge Sundae", price: "₹ 5", isVeg: true, description: "Chocolate sundae with hot fudge" },
  { name: "Strawberry Sundae", price: "₹ 5", isVeg: true, description: "Strawberry ice cream sundae" },
  { name: "Vanilla Milkshake", price: "₹ 4", isVeg: true, description: "Classic vanilla shake" },
  { name: "Butterscotch Milkshake", price: "₹ 6", isVeg: true, description: "Rich butterscotch flavor shake" },
  { name: "Choco Peanut Butter Milkshake", price: "₹ 5", isVeg: true, description: "Chocolate + peanut butter shake" },
];

// Food photos for the left column strip
const foodPhotos = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80",
  "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=300&q=80",
];

const Template4: React.FC<Template4Props> = ({ config = DEFAULT_TEMPLATE4_CONFIG }) => {
  const primaryColor = config.primaryColor;       // #f5e6c8 (cream)
  const accentColor = config.accentColor;         // #e8b84b (gold)
  const backgroundColor = config.backgroundColor; // #2c1a0a (dark brown)
  const footer = config.footer;
  const showPrice = config.layout.showPriceTag;
  const menuTypography = config.menuSection?.typography;

  const MenuSection = ({
    title,
    items,
  }: {
    title: string;
    items: {
      name: string;
      price: string;
      isVeg?: boolean;
      description?: string;
    }[];
  }) => (
    <div className="t4-section">
      <h2 className="t4-section-title">{title}</h2>
      <div className="t4-section-divider" />
      <div className="t4-items-list">
        {items.map((item, i) => (
  <div key={i} className="t4-item-row">
    
    <div className="t4-item-left">

      <div className="t4-item-name-line">
        
        {/* VEG INDICATOR */}
        {item.isVeg !== undefined && (
          <span
            className={`t4-veg-dot ${item.isVeg ? "veg" : "nonveg"}`}
            title={item.isVeg ? "Veg" : "Non-Veg"}
          />
        )}

        <span className="t4-item-name">{item.name}</span>
      </div>

      {/* DESCRIPTION */}
      {item.description && (
        <div className="t4-item-desc">
          {item.description}
        </div>
      )}
    </div>

    {showPrice && (
      <span className="t4-item-price">{item.price}</span>
    )}
  </div>
))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&family=Abril+Fatface&display=swap');

        .t4-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .t4-root {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          background-color: ${backgroundColor};
          display: flex;
          flex-direction: row;
          min-height: 900px;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* ── LEFT PHOTO STRIP ── */
        .t4-photo-strip {
          width: 32%;
          min-width: 160px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .t4-photo-strip img {
          width: 100%;
          flex: 1;
          object-fit: cover;
          display: block;
          min-height: 0;
        }

        /* ── RIGHT CONTENT ── */
        .t4-content {
          flex: 1;
          padding: 36px 32px 36px 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Brand heading — decorative slab serif */
        .t4-brand {
          font-family: 'Abril Fatface', 'Playfair Display', serif;
          font-size: ${config.headerSection?.typography?.headingFontSize ?? 64}px;
          font-weight: 400;
          color: ${accentColor};
          line-height: 0.95;
          letter-spacing: 2px;
          margin-bottom: 32px;
          word-break: break-word;
        }

        /* ── SECTION ── */
        .t4-section {
          margin-bottom: 28px;
        }

        .t4-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: ${menuTypography?.headingFontSize ?? 13}px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: ${accentColor};
          margin-bottom: 8px;
        }

        .t4-section-divider {
          height: 1.5px;
          background: ${primaryColor};
          opacity: 0.35;
          margin-bottom: 14px;
        }

        .t4-items-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .t4-item-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
        }

        .t4-item-name {
          font-size: ${menuTypography?.contentFontSize ?? 13}px;
          font-weight: ${menuTypography?.contentFontWeight ?? 400};
          color: ${primaryColor};
          opacity: 0.9;
          overflow-wrap: anywhere;
        }

        .t4-item-name-line {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .t4-item-price {
          font-size: ${menuTypography?.contentFontSize ?? 13}px;
          font-weight: 700;
          color: ${primaryColor};
          white-space: nowrap;
        }

        .t4-veg-dot {
          width: 10px;
          height: 10px;
          border: 1px solid currentColor;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: "white"
        }

        .t4-veg-dot::after {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          display: block;
        }

        .t4-veg-dot.veg { color: #39d353; }
        .t4-veg-dot.veg::after { background: #39d353; }
        .t4-veg-dot.nonveg { color: #ff5c5c; }
        .t4-veg-dot.nonveg::after { background: #ff5c5c; }

        .t4-item-desc {
          font-size: 10px;
          line-height: 1.35;
          color: ${primaryColor};
          opacity: 0.58;
        }

        /* ── FOOTER ── */
        .t4-footer {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1.5px solid ${primaryColor}55;
          text-align: ${alignToTextAlign(footer?.headingAlignment ?? "center")};
        }

        .t4-footer-title {
          font-family: 'Playfair Display', serif;
          font-size: ${footer?.headingFontSize ?? 16}px;
          font-weight: 700;
          color: ${accentColor};
          margin-bottom: 8px;
        }

        .t4-footer-row {
          display: flex;
          align-items: center;
          justify-content: ${alignToFlex(footer?.addressAlignment ?? "center")};
          gap: 6px;
          font-size: ${footer?.addressFontSize ?? 11}px;
          color: ${primaryColor};
          opacity: 0.75;
          margin-top: 5px;
        }

        .t4-social-row {
          display: flex;
          justify-content: ${alignToFlex(footer?.iconsAlignment ?? "center")};
          gap: 16px;
          margin-top: 14px;
        }

        .t4-social-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: ${primaryColor};
          opacity: 0.7;
          display: flex;
          align-items: center;
        }

        @media (max-width: 520px) {
          .t4-photo-strip { display: none; }
          .t4-brand { font-size: 44px; }
          .t4-content { padding: 24px 20px; }
        }
      `}</style>

      <div className="t4-root">

        {/* LEFT: stacked food photos */}
        <div className="t4-photo-strip">
          {foodPhotos.map((src, i) => (
            <img key={i} src={src} alt={`food-${i}`} />
          ))}
        </div>

        {/* RIGHT: menu content */}
        <div className="t4-content">

          {/* Brand name */}
          <div className="t4-brand">
            FAUGET<br />BURGER
          </div>

          <MenuSection title="Appetizers and Snacks" items={appetizersAndSnacks} />
          <MenuSection title="Gourmet Burgers" items={gourmetBurgers} />
          <MenuSection title="Burger Toppings" items={burgerToppings} />
          <MenuSection title="Milkshakes and Sundaes" items={milkshakesAndSundaes} />

          {/* Footer */}
          <div className="t4-footer">
            <div className="t4-footer-title">Fauget Burger</div>
            <div className="t4-footer-row">
              <MapPin size={12} />
              <span>123 Anywhere St, Any City</span>
            </div>
            <div className="t4-footer-row">
              <Phone size={12} />
              <span>+1 987 654 3210</span>
            </div>
            <div className="t4-social-row">
              <button className="t4-social-btn" aria-label="Facebook"><Facebook size={18} /></button>
              <button className="t4-social-btn" aria-label="Instagram"><Instagram size={18} /></button>
              <button className="t4-social-btn" aria-label="Twitter"><Twitter size={18} /></button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Template4;
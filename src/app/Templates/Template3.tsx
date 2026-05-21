import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE3_CONFIG } from "../pages/Templateconfig";
import { alignToFlex, alignToTextAlign } from "../utils/templateStyleUtils";
import { Facebook, Instagram, Twitter, MapPin, Phone } from "lucide-react";

interface Template3Props {
  config?: TemplateConfig;
}

const coffeeClassic = [
  { name: "Espresso", price: "₹3.00" },
  { name: "Americano", price: "₹3.50" },
  { name: "Cappuccino", price: "₹4.50" },
  { name: "Flat White", price: "₹4.50" },
  { name: "Mocha", price: "₹5.50" },
];

const icedCoffee = [
  { name: "Iced Americano", price: "₹4.00" },
  { name: "Iced Latte", price: "₹5.00" },
  { name: "Iced Mocha", price: "₹5.50" },
  { name: "Caramel Macchiato", price: "₹5.50" },
  { name: "Cold Brew", price: "₹4.50" },
];

const teaItems = [
  { name: "Thai Tea", price: "₹4.50" },
  { name: "Chai Tea", price: "₹4.50" },
  { name: "Matcha Latte", price: "₹5.50" },
  { name: "Hot Chocolate", price: "₹4.50" },
  { name: "Herbal Tea", price: "₹3.50" },
];

const snacks = [
  { name: "Croissant", price: "₹3.50" },
  { name: "Blueberry Muffin", price: "₹3.00" },
  { name: "Chocolate Cookie", price: "₹2.50" },
  { name: "Avocado Toast", price: "₹6.50" },
];

const Template3: React.FC<Template3Props> = ({ config = DEFAULT_TEMPLATE3_CONFIG }) => {
  const primaryColor = config.primaryColor;
  const backgroundColor = config.backgroundColor;
  const headerAlign = config.headerSection?.alignment ?? "center";
  const menuLayout = config.menuSection?.layout;
  const menuTypography = config.menuSection?.typography;
  const footer = config.footer;
  const showPrice = config.layout.showPriceTag;
  const showDividers = config.layout.showDividers;
  const menuColumns = Math.min(2, Math.max(1, config.layout.menuColumns));

  const sectionTitleAlign = alignToTextAlign(menuLayout?.headerAlignment ?? "start");
  const itemAlign = alignToTextAlign(menuLayout?.contentAlignment ?? "start");

  const styles: Record<string, React.CSSProperties> = {
    page: {
      background: backgroundColor,
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "20px",
      fontFamily: "'DM Sans', sans-serif",
    },
    container: {
      width: "100%",
      maxWidth: "480px",
      color: primaryColor,
      position: "relative",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: alignToFlex(headerAlign),
      textAlign: alignToTextAlign(headerAlign),
      marginBottom: "32px",
    },
    logo: {
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      objectFit: "contain",
      marginBottom: "12px",
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      textAlign: alignToTextAlign(headerAlign),
      fontSize: `${config.headerSection?.typography?.headingFontSize ?? 64}px`,
      fontWeight: config.headerSection?.typography?.headingFontWeight ?? 900,
      letterSpacing: "2px",
      color: primaryColor,
      lineHeight: 1,
      margin: "0 0 12px 0",
    },
    headerMeta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      fontSize: `${config.headerSection?.typography?.contentFontSize ?? 11}px`,
      fontWeight: config.headerSection?.typography?.contentFontWeight ?? 500,
      color: primaryColor,
      marginTop: "8px",
      gap: "8px",
      flexWrap: "wrap",
    },
    shopBadge: {
      border: `1.5px solid ${primaryColor}`,
      borderRadius: "50px",
      padding: "6px 16px",
      textAlign: "center",
      lineHeight: 1.4,
      whiteSpace: "nowrap",
      marginBottom: "10px"
    },
    badgeText: {
      margin: 0,
      fontSize: "11px",
    },
    badgeName: {
      fontWeight: 700,
      fontSize: "12px",
      margin: 0,
    },
    menuGrid: {
      display: "grid",
      gridTemplateColumns: `repeat(${menuColumns}, 1fr)`,
      gap: `${config.spacing.cardGap ?? 16}px`,
      marginBottom: `${config.spacing.sectionSpacing ?? 32}px`,
    },
    menuSection: {
      display: "flex",
      flexDirection: "column",
    },
    sectionTitle: {
      color: primaryColor,
      fontFamily: "'Playfair Display', serif",
      fontSize: `${menuTypography?.headingFontSize ?? 18}px`,
      fontWeight: menuTypography?.headingFontWeight ?? 700,
      margin: "0 0 12px 0",
      paddingBottom: showDividers ? "8px" : "0",
      borderBottom: showDividers ? `1.5px solid ${primaryColor}` : "none",
      textAlign: sectionTitleAlign,
      letterSpacing: "0.5px",
    },
    itemsList: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "4px",
      fontSize: `${menuTypography?.contentFontSize ?? 13}px`,
      fontWeight: menuTypography?.contentFontWeight ?? 400,
      color: primaryColor,
      textAlign: itemAlign,
    },
    itemLeft: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      gap: "6px",
    },
    itemName: {
      opacity: 0.85,
    },
    dotLine: {
      flex: 1,
      borderBottom: showDividers ? "1px dotted #999" : "none",
      margin: "0 6px",
      minWidth: "20px",
    },
    price: {
      width: "60px",
      textAlign: "right",
      fontWeight: 600,
      color: config.accentColor,
    },
    cupArea: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      marginTop: "24px",
      fontSize: "80px",
      lineHeight: 1,
    },
    footer: {
      marginTop: `${(footer?.spacing ?? config.spacing.sectionSpacing ?? 32) * 2}px`,
      borderTop: showDividers ? `1px solid ${primaryColor}` : "none",
      paddingTop: "24px",
      paddingBottom: "20px",
    },
    footerTitle: {
      color: primaryColor,
      fontFamily: "'Playfair Display', serif",
      fontSize: `${footer?.headingFontSize ?? 18}px`,
      fontWeight: 700,
      letterSpacing: "0.5px",
      margin: "0 0 12px 0",
      textAlign: alignToTextAlign(footer?.headingAlignment ?? "center"),
    },
    footerDetail: {
      display: "flex",
      alignItems: "center",
      justifyContent: alignToFlex(footer?.addressAlignment ?? "center"),
      gap: "6px",
      fontSize: `${footer?.addressFontSize ?? 12}px`,
      color: primaryColor,
      opacity: 0.85,
      marginTop: "6px",
    },
    socialRow: {
      display: "flex",
      justifyContent: alignToFlex(footer?.iconsAlignment ?? "center"),
      gap: "18px",
      marginTop: "18px",
    },
    socialBtn: {
      background: "none",
      border: "none",
      padding: "0",
      cursor: "pointer",
      color: primaryColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  const renderSection = (title: string, items: Array<{ name: string; price: string }>) => (
    <div style={styles.menuSection}>
      <div style={styles.sectionTitle}>{title}</div>
      <div style={styles.itemsList}>
        {items.map((item, index) => (
          <div key={index} style={styles.item}>
            <div style={styles.itemLeft}>
              <span style={styles.itemName}>{item.name}</span>
              {showDividers && <div style={styles.dotLine} />}
            </div>
            {showPrice && <div style={styles.price}>{item.price}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
  `}</style>
  
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <img src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-restaurant-logo-design-vector-template-png-image_5441058.jpg" alt="logo" style={styles.logo} />
              <div style={styles.shopBadge}>
                <p style={styles.badgeName}>RIMBERIO</p>
              </div>
            <h1 style={styles.title}>MENU</h1>
          </div>
          {/* Menu Grid */}
          <div style={styles.menuGrid}>
            {renderSection("Coffee Classics", coffeeClassic)}
            {renderSection("Iced Coffee", icedCoffee)}
            {renderSection("Tea & Non-Coffee", teaItems)}
            {renderSection("Pastries & Snacks", snacks)}
          </div>
          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.footerTitle}>Rimberio Coffee Shop</div>
            <div style={styles.footerDetail}>
              <MapPin size={13} />
              <span>123 Anywhere St, Any City</span>
            </div>
            <div style={styles.footerDetail}>
              <Phone size={13} />
              <span>+91 9876543210</span>
            </div>
            <div style={styles.socialRow}>
              <button style={styles.socialBtn} aria-label="Facebook">
                <Facebook size={20} />
              </button>
              <button style={styles.socialBtn} aria-label="Instagram">
                <Instagram size={20} />
              </button>
              <button style={styles.socialBtn} aria-label="Twitter">
                <Twitter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Template3;
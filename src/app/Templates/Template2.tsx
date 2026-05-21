import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE2_CONFIG } from "../pages/Templateconfig";
import { alignToFlex, alignToTextAlign } from "../utils/templateStyleUtils";

interface Template2Props {
  config?: TemplateConfig;
}

const Template2: React.FC<Template2Props> = ({ config = DEFAULT_TEMPLATE2_CONFIG }) => {
  const headerAlign = config.headerSection?.alignment ?? "center";
  const menuLayout = config.menuSection?.layout;
  const menuTypography = config.menuSection?.typography;
  const footer = config.footer;
  const showPrice = config.layout.showPriceTag;

  const sectionTitleAlign = alignToTextAlign(menuLayout?.headerAlignment ?? "center");
  const itemAlign = alignToTextAlign(menuLayout?.contentAlignment ?? "start");

  const styles: Record<string, React.CSSProperties> = {
    page: {
      background: config.backgroundColor,
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      width: "100%",
      maxWidth: "420px",
      color: "#fff",
      position: "relative",
    },
    title: {
      textAlign: alignToTextAlign(headerAlign),
      fontSize: `${config.headerSection?.typography?.headingFontSize ?? 44}px`,
      fontWeight: config.headerSection?.typography?.headingFontWeight ?? 900,
      letterSpacing: "2px",
      color: config.accentColor,
      marginTop: "20px",
      marginBottom: "20px",
    },
    sectionBox: {
      border: config.layout.cardStyle === "flat" ? "none" : "2px solid #fff",
      borderRadius: "30px",
      padding: "20px",
      marginBottom: `${config.spacing.sectionSpacing}px`,
      position: "relative",
      boxShadow: config.layout.cardStyle === "elevated" ? "0 8px 24px rgba(0,0,0,0.4)" : undefined,
    },
    sectionTitleWrap: {
      position: "absolute",
      top: "-18px",
      left: sectionTitleAlign === "center" ? "50%" : sectionTitleAlign === "right" ? "auto" : "20px",
      right: sectionTitleAlign === "right" ? "20px" : "auto",
      transform: sectionTitleAlign === "center" ? "translateX(-50%)" : undefined,
      background: "#fff",
      padding: "6px 20px",
      borderRadius: "6px",
    },
    sectionTitle: {
      color: config.accentColor,
      fontWeight: menuTypography?.headingFontWeight ?? 900,
      fontSize: `${menuTypography?.headingFontSize ?? 18}px`,
      letterSpacing: "1px",
      textAlign: sectionTitleAlign,
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "10px",
      fontSize: `${menuTypography?.contentFontSize ?? 14}px`,
      textAlign: itemAlign,
    },
    left: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      gap: "6px",
    },
    dotLine: {
      flex: 1,
      borderBottom: config.layout.showDividers ? "1px dotted #aaa" : "none",
      margin: "0 6px",
    },
    price: {
      width: "60px",
      textAlign: "right",
      color: "#fff",
      fontWeight: 600,
    },
    drinkBox: {
      border: "2px solid #fff",
      borderRadius: "30px",
      padding: "20px",
      position: "relative",
    },
    imageCircle: {
      position: "absolute",
      borderRadius: "50%",
      overflow: "hidden",
      border: `6px solid ${config.backgroundColor}`,
    },
    // img1: { width: "80px", height: "80px", top: "-40px", left: "10px" },
    // img2: { width: "140px", height: "140px", top: "-50px", right: "0px" },
    // img3: { width: "150px", height: "150px", bottom: "-50px", right: "10px" },
    // img4: { width: "120px", height: "120px", bottom: "-40px", left: "10px" },
    footer: {
      marginTop: `${(footer?.spacing ?? config.spacing.sectionSpacing) * 2}px`,
      borderTop: config.layout.showDividers ? "1px dashed #555" : "none",
      paddingTop: "30px",
      paddingBottom: "20px",
    },
    footerTitle: {
      color: config.accentColor,
      fontSize: `${footer?.headingFontSize ?? 24}px`,
      fontWeight: 900,
      letterSpacing: "1px",
      marginBottom: "10px",
      textAlign: alignToTextAlign(footer?.headingAlignment ?? "center"),
    },
    footerAddress: {
      color: "#aaa",
      fontSize: `${footer?.addressFontSize ?? 14}px`,
      lineHeight: 1.6,
      marginBottom: "20px",
      textAlign: alignToTextAlign(footer?.addressAlignment ?? "center"),
    },
    socialLinks: {
      display: "flex",
      justifyContent: alignToFlex(footer?.iconsAlignment ?? "center"),
      gap: "16px",
    },
    socialIcon: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      border: "1px solid #555",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textDecoration: "none",
    },
  };

const mainCourses = [
  ["Truffle Chicken Bowl", "₹39", false],
  ["Teriyaki Chicken Bowl", "₹39", false],
  ["Spicy Chicken", "₹39", false],
  ["Steak", "₹49", false],
  ["Beef Stew", "₹49", false],
];

const appetizers = [
  ["Pudding", "₹21", true],
  ["Pastry", "₹31", true],
  ["Donut", "₹21", true],
  ["Chicken Nugget", "₹29", false],
  ["Beef Burger", "₹31", false],
];

const drinks = [
  ["Organic Tea", "₹21", true],
  ["Lemonade", "₹21", true],
  ["Hot Coffee", "₹29", true],
  ["Hot Chocolate", "₹29", true],
  ["Iced Coffee", "₹29", true],
  ["Milkshake", "₹31", true],
  ["Smoothie", "₹31", true],
];

  const renderSection = (title: string, items: any[]) => (
  <div style={styles.sectionBox}>
    <div style={styles.sectionTitleWrap}>
      <div style={styles.sectionTitle}>{title}</div>
    </div>

    <div style={{ marginTop: "20px" }}>
      {items.map((item, i) => (
        <div key={i} style={styles.item}>
          
          {/* LEFT SIDE */}
          <div style={styles.left}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {item[0]}

              {/* VEG / NON-VEG BADGE (SAFE CHECK) */}
              {item[2] !== undefined && (
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    backgroundColor: item[2] ? "#e8f5e9" : "#ffebee",
                    color: item[2] ? "#2e7d32" : "#c62828",
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  {item[2] ? "Veg" : "Non-Veg"}
                </span>
              )}
            </span>

            {config.layout.showDividers && <div style={styles.dotLine} />}
          </div>

          {/* PRICE */}
          {showPrice && <div style={styles.price}>{item[1]}</div>}
        </div>
      ))}
    </div>
  </div>
);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.title}>FOOD MENU</div>
        {renderSection("MAIN COURSES", mainCourses)}
        {renderSection("APPETIZERS", appetizers)}

        <div style={styles.drinkBox}>
          <div style={styles.sectionTitleWrap}>
            <div style={styles.sectionTitle}>DRINK</div>
          </div>
          <div style={{ marginTop: "20px" }}>
            {drinks.map((item, i) => (
              <div key={i} style={styles.item}>
                <div style={styles.left}>
                  <span>{item[0]}</span>
                  {item[2] !== undefined && (
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    backgroundColor: item[2] ? "#e8f5e9" : "#ffebee",
                    color: item[2] ? "#2e7d32" : "#c62828",
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  {item[2] ? "Veg" : "Non-Veg"}
                </span>
              )}
                  {config.layout.showDividers && <div style={styles.dotLine} />}
                </div>
                {showPrice && <div style={styles.price}>{item[1]}</div>}

                
              </div>
            ))}
          </div>

          {/* <div style={{ ...styles.imageCircle, ...styles.img1 }}>
            <img
              src="https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Food 1"
            />
          </div>
          <div style={{ ...styles.imageCircle, ...styles.img2 }}>
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Food 2"
            />
          </div>
          <div style={{ ...styles.imageCircle, ...styles.img3 }}>
            <img
              src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Food 3"
            />
          </div>
          <div style={{ ...styles.imageCircle, ...styles.img4 }}>
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=300"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Food 4"
            />
          </div> */}
        </div>

        <div style={styles.footer}>
          <div style={styles.footerTitle}>Wardiere Restaurant</div>
          <div style={styles.footerAddress}>
            123 Culinary Boulevard, Foodville, NY 10001
            <br />
            +1 (555) 123-4567 • hello@wardiererestaurant.com
          </div>
          <div style={styles.socialLinks}>
            {/* Facebook */}
            <a href="#" style={styles.socialIcon} aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" style={styles.socialIcon} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2.5a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="#" style={styles.socialIcon} aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2H21l-6.52 7.46L22 22h-6.79l-5.31-6.9L3.9 22H1l7.02-8.03L2 2h6.9l4.82 6.32L18.244 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;

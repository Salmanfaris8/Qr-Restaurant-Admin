export type TemplateType =
  | "template1"
  | "template2"
  | "template3"
  | "template4"
  | "template5"
  | "template6"
  | "template7"
  | "template8"
  | "template9"
  | "template10"
  | "template11"
  | "template12"
  | "template13"
  | "template14"
  | "template15"
  | "template16"
  | "template17"
  | "template18"
  | "template19"
  | "template20";

export interface ElementPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation: number;
  opacity: number;
}

export interface TemplateElement {
  id: string;
  type: "header" | "image" | "text" | "card" | "section" | "divider";
  position: ElementPosition;
  content?: {
    text?: string;
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    alignment?: "left" | "center" | "right";
    imageUrl?: string;
  };
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: number;
    shadow?: boolean;
  };
}

// Section-level typography controls
export interface SectionTypography {
  headingFontSize: number;
  contentFontSize: number;
  headingFontWeight: 400 | 500 | 600 | 700 | 800 | 900;
  contentFontWeight: 400 | 500 | 600 | 700;
}

// Section layout configuration
export interface SectionLayout {
  headerAlignment: "start" | "center" | "end";
  contentAlignment: "start" | "center" | "end";
  imagePosition: "left" | "right" | "none";
  contentPosition: "left" | "right" | "center";
  gap: number;
}

// Footer configuration
export interface FooterConfig {
  headingAlignment: "start" | "center" | "end";
  addressAlignment: "start" | "center" | "end";
  iconsAlignment: "start" | "center" | "end";
  headingFontSize: number;
  addressFontSize: number;
  spacing: number;
}

export interface TemplateConfig {
  id: string;
  templateType: TemplateType;
  version: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: "serif" | "sans-serif" | "display";
  elements: TemplateElement[];
  spacing: {
    headerHeight: number;
    sectionSpacing: number;
    cardGap: number;
  };
  layout: {
    menuColumns: 1 | 2 | 3;
    cardStyle: "flat" | "bordered" | "elevated";
    showDividers: boolean;
    showPriceTag: boolean;
  };
  // Section-level controls
  headerSection?: {
    alignment: "start" | "center" | "end";
    typography: SectionTypography;
  };
  menuSection?: {
    layout: SectionLayout;
    typography: SectionTypography;
  };
  footer?: FooterConfig;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Default configurations
// ---------------------------------------------------------------------------

export const DEFAULT_TEMPLATE1_CONFIG: TemplateConfig = {
  id: "template1-default",
  templateType: "template1",
  version: "1.0",
  name: "Modern Minimal",
  primaryColor: "#1E88E5",
  accentColor: "#00C853",
  backgroundColor: "#E8D967",
  fontFamily: "sans-serif",
  elements: [
    {
      id: "header-pill",
      type: "text",
      position: { id: "header-pill", x: 40, y: 30, width: 150, height: 40, zIndex: 10, rotation: 0, opacity: 1 },
      content: { text: "Restaurant Name", fontSize: 16, fontWeight: 500, color: "#fff", alignment: "center" },
      style: { backgroundColor: "#386629", borderRadius: 25, padding: 10 },
    },
    {
      id: "main-title",
      type: "text",
      position: { id: "main-title", x: 40, y: 80, width: 300, height: 80, zIndex: 10, rotation: 0, opacity: 1 },
      content: { text: "FOOD MENU", fontSize: 85, fontWeight: 900, color: "#151624", alignment: "left" },
    },
    {
      id: "menu-section",
      type: "card",
      position: { id: "menu-section", x: 40, y: 180, width: 280, height: 400, zIndex: 5, rotation: 0, opacity: 1 },
      style: { backgroundColor: "#386629", borderRadius: 24, padding: 24 },
    },
    {
      id: "footer",
      type: "section",
      position: { id: "footer", x: 40, y: 600, width: 320, height: 100, zIndex: 5, rotation: 0, opacity: 1 },
      style: { backgroundColor: "#386629", borderRadius: 24, padding: 40 },
    },
  ],
  spacing: {
    headerHeight: 200,
    sectionSpacing: 30,
    cardGap: 24,
  },
  layout: {
    menuColumns: 2,
    cardStyle: "bordered",
    showDividers: true,
    showPriceTag: true,
  },
  headerSection: {
    alignment: "center",
    typography: {
      headingFontSize: 32,
      contentFontSize: 16,
      headingFontWeight: 700,
      contentFontWeight: 400,
    },
  },
  menuSection: {
    layout: {
      headerAlignment: "center",
      contentAlignment: "start",
      imagePosition: "right",
      contentPosition: "left",
      gap: 24,
    },
    typography: {
      headingFontSize: 24,
      contentFontSize: 14,
      headingFontWeight: 700,
      contentFontWeight: 400,
    },
  },
  footer: {
    headingAlignment: "center",
    addressAlignment: "center",
    iconsAlignment: "center",
    headingFontSize: 18,
    addressFontSize: 12,
    spacing: 16,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_TEMPLATE2_CONFIG: TemplateConfig = {
  id: "template2-default",
  templateType: "template2",
  version: "1.0",
  name: "Dark Mode Menu",
  primaryColor: "#1F1F1F",
  accentColor: "#BB86FC",
  backgroundColor: "#0b0b0b",
  fontFamily: "sans-serif",
  elements: [
    {
      id: "header-title",
      type: "text",
      position: { id: "header-title", x: 0, y: 20, width: 420, height: 60, zIndex: 10, rotation: 0, opacity: 1 },
      content: { text: "FOOD MENU", fontSize: 44, fontWeight: 900, color: "#d97706", alignment: "center" },
    },
    {
      id: "menu-cards",
      type: "card",
      position: { id: "menu-cards", x: 0, y: 100, width: 420, height: 500, zIndex: 5, rotation: 0, opacity: 1 },
      style: { backgroundColor: "transparent", borderColor: "#fff", borderWidth: 2, borderRadius: 30 },
    },
    {
      id: "footer-section",
      type: "section",
      position: { id: "footer-section", x: 0, y: 620, width: 420, height: 100, zIndex: 5, rotation: 0, opacity: 1 },
      style: { backgroundColor: "transparent", borderColor: "#fff", borderWidth: 2, borderRadius: 30 },
    },
  ],
  spacing: {
    headerHeight: 80,
    sectionSpacing: 20,
    cardGap: 16,
  },
  layout: {
    menuColumns: 1,
    cardStyle: "bordered",
    showDividers: true,
    showPriceTag: true,
  },
  headerSection: {
    alignment: "center",
    typography: {
      headingFontSize: 44,
      contentFontSize: 14,
      headingFontWeight: 900,
      contentFontWeight: 400,
    },
  },
  menuSection: {
    layout: {
      headerAlignment: "center",
      contentAlignment: "start",
      imagePosition: "none",
      contentPosition: "center",
      gap: 16,
    },
    typography: {
      headingFontSize: 18,
      contentFontSize: 14,
      headingFontWeight: 700,
      contentFontWeight: 400,
    },
  },
  footer: {
    headingAlignment: "center",
    addressAlignment: "center",
    iconsAlignment: "center",
    headingFontSize: 16,
    addressFontSize: 12,
    spacing: 12,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_TEMPLATE3_CONFIG: TemplateConfig = {
  id: "template3-default",
  templateType: "template3",
  version: "1.0",
  name: "Coffee Shop Menu",
  primaryColor: "#1D56B3",
  accentColor: "#1D56B3",
  backgroundColor: "#F4F4F4",
  fontFamily: "serif",
  elements: [],
  spacing: {
    headerHeight: 200,
    sectionSpacing: 32,
    cardGap: 20,
  },
  layout: {
    menuColumns: 2,
    cardStyle: "flat",
    showDividers: false,
    showPriceTag: true,
  },
  headerSection: {
    alignment: "center",
    typography: {
      headingFontSize: 64,
      contentFontSize: 11,
      headingFontWeight: 900,
      contentFontWeight: 500,
    },
  },
  menuSection: {
    layout: {
      headerAlignment: "start",
      contentAlignment: "start",
      imagePosition: "none",
      contentPosition: "left",
      gap: 20,
    },
    typography: {
      headingFontSize: 18,
      contentFontSize: 13,
      headingFontWeight: 700,
      contentFontWeight: 400,
    },
  },
  footer: {
    headingAlignment: "center",
    addressAlignment: "center",
    iconsAlignment: "center",
    headingFontSize: 18,
    addressFontSize: 12,
    spacing: 24,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_TEMPLATE4_CONFIG: TemplateConfig = {
  id: "template4-default",
  templateType: "template4",
  version: "1.0",
  name: "Fauget Burger Menu",
  primaryColor: "#f5e6c8",
  accentColor: "#e8b84b",
  backgroundColor: "#2c1a0a",
  fontFamily: "serif",
  elements: [],
  spacing: {
    headerHeight: 200,
    sectionSpacing: 32,
    cardGap: 20,
  },
  layout: {
    menuColumns: 2,
    cardStyle: "flat",
    showDividers: true,
    showPriceTag: true,
  },
  headerSection: {
    alignment: "center",
    typography: {
      headingFontSize: 64,
      contentFontSize: 11,
      headingFontWeight: 900,
      contentFontWeight: 500,
    },
  },
  menuSection: {
    layout: {
      headerAlignment: "start",
      contentAlignment: "start",
      imagePosition: "none",
      contentPosition: "left",
      gap: 20,
    },
    typography: {
      headingFontSize: 18,
      contentFontSize: 13,
      headingFontWeight: 700,
      contentFontWeight: 400,
    },
  },
  footer: {
    headingAlignment: "center",
    addressAlignment: "center",
    iconsAlignment: "center",
    headingFontSize: 18,
    addressFontSize: 12,
    spacing: 24,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

export const exportConfigAsJSON = (config: TemplateConfig): string => {
  return JSON.stringify(config, null, 2);
};

export const importConfigFromJSON = (jsonString: string): TemplateConfig => {
  return JSON.parse(jsonString);
};

export const updateElementPosition = (
  config: TemplateConfig,
  elementId: string,
  updates: Partial<ElementPosition>
): TemplateConfig => {
  return {
    ...config,
    elements: config.elements.map((el) =>
      el.id === elementId
        ? { ...el, position: { ...el.position, ...updates } }
        : el
    ),
    updatedAt: new Date().toISOString(),
  };
};

export const cloneConfig = (config: TemplateConfig): TemplateConfig => {
  return JSON.parse(JSON.stringify(config));
};

/** Editable slice shown in the template editor live JSON panel */
export type LiveEditorConfig = Pick<
  TemplateConfig,
  | "id"
  | "name"
  | "templateType"
  | "primaryColor"
  | "accentColor"
  | "backgroundColor"
  | "layout"
  | "headerSection"
  | "menuSection"
  | "footer"
  | "updatedAt"
>;

export const getLiveEditorConfig = (config: TemplateConfig): LiveEditorConfig => ({
  id: config.id,
  name: config.name,
  templateType: config.templateType,
  primaryColor: config.primaryColor,
  accentColor: config.accentColor,
  backgroundColor: config.backgroundColor,
  layout: config.layout,
  headerSection: config.headerSection,
  menuSection: config.menuSection,
  footer: config.footer,
  updatedAt: config.updatedAt,
});

export const stringifyLiveEditorConfig = (config: TemplateConfig): string =>
  JSON.stringify(getLiveEditorConfig(config), null, 2);
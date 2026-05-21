import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Check, Edit3 } from "lucide-react";
import { TemplateEditor } from "../pages/Templateeditor";
import {
  TemplateConfig,
  DEFAULT_TEMPLATE1_CONFIG,
  DEFAULT_TEMPLATE2_CONFIG,
  DEFAULT_TEMPLATE3_CONFIG,
  DEFAULT_TEMPLATE4_CONFIG,
} from "../pages/Templateconfig";
import Template1 from "../Templates/Template1";
import Template2 from "../Templates/Template2";
import Template3 from "../Templates/Template3";
import Template4 from "../Templates/Template4";
import axios from "axios";

type TemplateType = "template1" | "template2" | "template3" | "template4" | string;

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  primaryColor: string;
  accentColor: string;
  tier?: string;
  sortOrder?: number;
  isTemplate?: boolean;
  templateComponent?: React.ComponentType<any>;
  defaultConfig?: TemplateConfig;
}

type ApiTheme = {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  tier: string;
  sortOrder?: number;
  templateType?: TemplateType;
  // If you choose to expose config in list later, Restaurant Admin will use it automatically.
  config?: TemplateConfig;
};

type AvailableThemesResponse = {
  success: boolean;
  plan?: string;
  allowedCount?: number;
  activeThemeId?: string | null;
  data: ApiTheme[];
};

function inferTemplateKind(...values: unknown[]): TemplateType {
  const text = values.map((value) => String(value ?? "").toLowerCase());
  const templateMatch = text
    .map((value) => value.match(/template\s*-?\s*(\d+)/)?.[1])
    .find(Boolean);

  if (templateMatch) return `template${templateMatch}`;

  if (text.some((value) => value.includes("coffee") || value.includes("cafe") || value.includes("rimberio"))) {
    return "template3";
  }
  if (text.some((value) => value.includes("burger") || value.includes("fauget"))) return "template4";
  if (text.some((value) => value.includes("dark"))) return "template2";

  return "template1";
}

function getDefaultsForKind(kind: TemplateType) {
  switch (kind) {
    case "template2":
      return {
        defaultConfig: DEFAULT_TEMPLATE2_CONFIG,
        component: Template2,
      };
    case "template3":
      return {
        defaultConfig: DEFAULT_TEMPLATE3_CONFIG,
        component: Template3,
      };
    case "template4":
      return {
        defaultConfig: DEFAULT_TEMPLATE4_CONFIG,
        component: Template4,
      };
    case "template1":
    default:
      return {
        defaultConfig: DEFAULT_TEMPLATE1_CONFIG,
        component: Template1,
      };
  }
}

function normalizeConfigForKind(
  kind: TemplateType,
  config: TemplateConfig,
  themeName?: string
): TemplateConfig {
  const { defaultConfig } = getDefaultsForKind(kind);
  return {
    ...defaultConfig,
    ...config,
    id: config.id ?? defaultConfig.id,
    name: config.name ?? themeName ?? defaultConfig.name,
    templateType: kind,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeSavedConfigs(
  configs: Record<string, TemplateConfig>
): Record<string, TemplateConfig> {
  return Object.fromEntries(
    Object.entries(configs).map(([themeId, config]) => {
      const kind = inferTemplateKind(config?.id, config?.templateType, themeId, config?.name);
      return [themeId, normalizeConfigForKind(kind, config)];
    })
  );
}

export function ThemeSelection() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorConfig, setEditorConfig] = useState<TemplateConfig | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<Record<string, TemplateConfig>>({});
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Replace this in ThemeSelection.tsx
  // Some generated projects miss Vite `ImportMetaEnv` typing in TS server diagnostics.
  // Cast keeps runtime behavior identical.
  const API = (import.meta as any).env?.VITE_API_URL as string;

  // Add this token getter (same as MenuCategories.tsx)
  const getToken = () => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("token_expires_at");

    if (!token || !expiresAt) return null;

    if (new Date() > new Date(expiresAt)) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      localStorage.removeItem("token_expires_at");
      return null;
    }

    return token;
  };

  useEffect(() => {
    const data = localStorage.getItem("subscription");
    const popupShown = localStorage.getItem("subscription_popup_shown");
    const savedConfigsData = localStorage.getItem("templateConfigs");

    

    const parsed = data ? JSON.parse(data) : null;
    const isExpired = parsed?.expiresAt && Date.now() > parsed.expiresAt;

    if (parsed && !isExpired) {
      setSubscription(parsed);
      setShowPopup(false);
      localStorage.removeItem("subscription_popup_shown");
    } else {
      if (!popupShown) {
        setShowPopup(true);
        localStorage.setItem("subscription_popup_shown", "true");
      }

      if (isExpired) {
        localStorage.removeItem("subscription");
      }
    }

    if (savedConfigsData) {
      const normalized = normalizeSavedConfigs(JSON.parse(savedConfigsData));
      setSavedConfigs(normalized);
      localStorage.setItem("templateConfigs", JSON.stringify(normalized));
    }
  }, []);

  useEffect(() => {
    const fetchAvailableThemes = async () => {
      try {
        setLoadingThemes(true);
        const token = getToken();
        if (!token) return;

        const res = await axios.get<AvailableThemesResponse>(`${API}/hotel-admin/themes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const payload = res.data;
        if (!payload?.success) return;

        const apiThemes = payload.data ?? [];

        let nextSavedConfigs: Record<string, TemplateConfig> = { ...savedConfigs };
        let savedConfigsChanged = false;

        const mapped: Theme[] = apiThemes.map((t, idx) => {
          // If backend theme config/templateType is not sent here, infer catalog kind by name,
          // and also handle the common case where sortOrder makes template2 second.
          const inferredKind = inferTemplateKind(
            t.templateType,
            t.config?.id,
            t.config?.templateType,
            t.id,
            t.name
          );
          const { defaultConfig, component } = getDefaultsForKind(inferredKind);

          const backendConfig = t.config;
          const saved = savedConfigs[t.id];
          const config = backendConfig ?? saved ?? defaultConfig;

          // Prefer backend config (if present) and normalize to the inferred kind so
          // both Restaurant Admin + Super Admin render the same alignment/colors.
          if (backendConfig || saved) {
            const normalized = normalizeConfigForKind(inferredKind, backendConfig ?? saved, t.name);
            if (JSON.stringify(nextSavedConfigs[t.id]) !== JSON.stringify(normalized)) {
              nextSavedConfigs = { ...nextSavedConfigs, [t.id]: normalized };
              savedConfigsChanged = true;
            }
          }
          const normalizedForSwatches =
            backendConfig || saved ? normalizeConfigForKind(inferredKind, config, t.name) : defaultConfig;

          return {
            id: t.id,
            name: t.name,
            description: t.description,
            preview: t.previewImage,
            tier: t.tier,
            sortOrder: t.sortOrder,
            primaryColor: normalizedForSwatches.primaryColor,
            accentColor: normalizedForSwatches.accentColor,
            isTemplate: inferredKind.startsWith("template"),
            templateComponent: component,
            defaultConfig,
          };
        });

        // If backend started returning configs, store them so preview/editor uses backend JSON.
        if (savedConfigsChanged) {
          setSavedConfigs(nextSavedConfigs);
          localStorage.setItem("templateConfigs", JSON.stringify(nextSavedConfigs));
        }

        setThemes(mapped);
        setActiveThemeId(payload.activeThemeId ?? null);

        if (payload.activeThemeId) {
          setSelectedTheme(payload.activeThemeId);
        } else if (mapped.length > 0) {
          setSelectedTheme(mapped[0].id);
        }
      } catch (err) {
        console.log("Error fetching themes:", err);
      } finally {
        setLoadingThemes(false);
      }
    };

    fetchAvailableThemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API]);

  const requireSubscription = () => {
    if (!subscription) {
      setShowPopup(true);
      return false;
    }

    if (subscription?.expiresAt && Date.now() > subscription.expiresAt) {
      localStorage.removeItem("subscription");
      setSubscription(null);
      setShowPopup(true);
      return false;
    }

    return true;
  };

  const handleEditTemplate = (themeId: string) => {
    if (!requireSubscription()) return;

    const theme = themes.find((t) => t.id === themeId);
    if (!theme || !theme.defaultConfig) return;

    const kind = inferTemplateKind(
      savedConfigs[themeId]?.id,
      savedConfigs[themeId]?.templateType,
      theme.defaultConfig.id,
      theme.defaultConfig.templateType,
      theme.id,
      theme.name
    );
    const savedConfig = normalizeConfigForKind(
      kind,
      savedConfigs[themeId] ?? theme.defaultConfig,
      theme.name
    );

    setEditingThemeId(themeId);
    setEditorConfig(JSON.parse(JSON.stringify(savedConfig)));
    setShowEditor(true);
  };

  const getConfigForTheme = (
  themeId: string
): TemplateConfig | undefined => {

  const theme = themes.find(
    (t) => t.id === themeId
  );

  if (!theme) return undefined;

  const saved = savedConfigs[themeId];

  const config =
    saved ??
    theme.defaultConfig;

  if (!config) return undefined;

  const kind = inferTemplateKind(
    config.id,
    config.templateType,
    theme.defaultConfig?.id,
    theme.defaultConfig?.templateType,
    theme.id,
    theme.name
  );

  return normalizeConfigForKind(
    kind,
    config,
    theme.name
  );
};

  const handleSave = async (config: TemplateConfig) => {
    const themeId = editingThemeId ?? selectedTheme;
    const theme = themes.find((t) => t.id === themeId);
    const kind = theme
      ? inferTemplateKind(
          config.id,
          config.templateType,
          theme.defaultConfig?.id,
          theme.defaultConfig?.templateType,
          theme.id,
          theme.name
        )
      : inferTemplateKind(config.id, config.templateType, themeId, config.name);
    const normalizedConfig = normalizeConfigForKind(kind, config, theme?.name);

    console.log("SAVED TEMPLATE JSON:", normalizedConfig);

    setSavedConfigs((prev) => {
      const updated = {
        ...prev,
        [themeId]: normalizedConfig,
      };
      localStorage.setItem("templateConfigs", JSON.stringify(updated));
      return updated;
    });

    // Persist edited JSON to backend
    try {
      const token = getToken();
      if (token) {
        await axios.put(
          `${API}/hotel-admin/${themeId}`,
          { config: normalizedConfig },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (err) {
      console.log("Theme update failed (saved locally):", err);
    }

    setSelectedTheme(themeId);
    setShowEditor(false);
    setEditingThemeId(null);
    setEditorConfig(null);
  };

  const handleApplyTheme = async () => {
    if (!requireSubscription()) return;
    setIsApplying(true);
    setApplyError(null);
    try {
      const token = getToken();
      if (!token) {
        setApplyError("Session expired. Please log in again.");
        return;
      }
  
      const appliedConfig = getConfigForTheme(selectedTheme);
      if (!appliedConfig) {
        setApplyError("No configuration found for this theme.");
        return;
      }

      const res = await axios.post(
        `${API}/hotel-admin/theme/apply-theme`,
        {
          menuThemeId: selectedTheme,
          appliedConfig,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      if (!data.success) {
        setApplyError(data.message || "Failed to apply theme.");
        return;
      }

      // RestaurantThemeConfig row: { restaurantId, menuThemeId, appliedConfig, ... }
      const payload = data?.data ?? {};
      const nextActiveId = payload.menuThemeId ?? selectedTheme;
      const nextConfig = payload.appliedConfig ?? appliedConfig;

      localStorage.setItem("activeThemeId", nextActiveId);
      if (nextConfig) {
        localStorage.setItem("activeThemeConfig", JSON.stringify(nextConfig));
      }

      const theme = themes.find((t) => t.id === nextActiveId);
      const inferredKind = theme
        ? inferTemplateKind(
            (nextConfig as TemplateConfig)?.id,
            (nextConfig as TemplateConfig)?.templateType,
            theme.defaultConfig?.id,
            theme.defaultConfig?.templateType,
            theme.id,
            theme.name
          )
        : inferTemplateKind((nextConfig as TemplateConfig)?.id, (nextConfig as TemplateConfig)?.templateType);
      const normalized = normalizeConfigForKind(inferredKind, nextConfig as TemplateConfig, theme?.name);
      setSavedConfigs((prev) => {
        const updated = { ...prev, [nextActiveId]: normalized };
        localStorage.setItem("templateConfigs", JSON.stringify(updated));
        return updated;
      });

      setActiveThemeId(nextActiveId);
  
    } catch (err: any) {
      const message = err.response?.data?.message || "Network error. Please try again.";
      setApplyError(message);
    } finally {
      setIsApplying(false);
    }
  };

  const selectedThemeObj = themes.find((t) => t.id === selectedTheme);
  const TemplateComponent = selectedThemeObj?.templateComponent;

  const isSelectedThemeEditable = useMemo(() => {
    const id = selectedThemeObj?.id;
    if (!id) return false;
    // Allow editor only when we have a known template component + defaultConfig
    return Boolean(selectedThemeObj?.templateComponent && selectedThemeObj?.defaultConfig);
  }, [selectedThemeObj]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Menu Theme Selection</h1>
        <p className="text-gray-500 mt-1">Choose a theme for your customer-facing menu</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Preview Mode:</strong> Select a template to preview and edit its layout. Click "Edit Template" to customize positioning and styling. The configuration is saved as JSON for your database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingThemes ? (
          <Card className="bg-white shadow-sm border-2 border-gray-200">
            <CardContent className="p-5">
              <p className="text-sm text-gray-600">Loading themes...</p>
            </CardContent>
          </Card>
        ) : (
        themes.map((theme) => {
          const liveConfig = getConfigForTheme(theme.id);
          return (
            <Card
            key={theme.id}
            className={`bg-white shadow-sm border-2 transition-all cursor-pointer ${
              selectedTheme === theme.id
                ? "border-[#1E88E5] shadow-lg scale-105"
                : "border-gray-200 hover:shadow-md hover:scale-102"
            }`}
            onClick={() => {
              if (!requireSubscription()) return;
              setSelectedTheme(theme.id);
            }}
          >
            <div className="relative">
              <img
                src={theme.preview}
                alt={theme.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {selectedTheme === theme.id && (
                <div className="absolute top-3 right-3">
                  <div className="bg-[#1E88E5] text-white rounded-full p-2">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{theme.name}</h3>
                {activeThemeId === theme.id && (
                  <Badge className="bg-[#00C853]">Active</Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{theme.description}</p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: liveConfig?.primaryColor }}
                  />
                  <span className="text-xs text-gray-500">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: liveConfig?.accentColor }}
                  />
                  <span className="text-xs text-gray-500">Accent</span>
                </div>
              </div>

              {theme.isTemplate && selectedTheme === theme.id && isSelectedThemeEditable && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTemplate(theme.id);
                  }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 gap-2"
                  size="sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Template
                </Button>
              )}
            </CardContent>
          </Card>
          )
}))}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          className="flex-1 sm:flex-initial"
          onClick={() => {
            if (!requireSubscription()) return;
          }}
        >
          Preview Menu
        </Button>
        <Button
          className="bg-[#1E88E5] hover:bg-[#1976D2] flex-1 sm:flex-initial"
          onClick={handleApplyTheme}
          disabled={isApplying}
        >
          {isApplying ? "Applying..." : "Apply Theme"}
        </Button>
      </div>

      {applyError && (
          <p style={{ marginTop: "-20px" }} className="text-sm text-red-600 text-end">{applyError}</p>
        )}

      {/* Live Preview Section */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Live Menu Preview</h2>
          <div className="bg-gray-100 rounded-lg p-4 sm:p-8 flex items-center justify-center overflow-auto">
            {TemplateComponent ? (
              <div className="w-full">
                <TemplateComponent
                  config={getConfigForTheme(selectedTheme)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border-8 border-gray-800 p-6">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-semibold mb-2">{selectedThemeObj?.name}</p>
                  <p className="text-sm">Preview coming soon for this theme</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template Editor Modal */}
      {showEditor && editorConfig && (
        <TemplateEditor
          config={editorConfig}
          renderPreview={(liveConfig: TemplateConfig) => {
            const editingTheme = themes.find(
              (t) => t.id === (editingThemeId ?? selectedTheme)
            );
            const Template = editingTheme?.templateComponent;
            return Template ? <Template config={liveConfig} /> : null;
          }}
          onSave={handleSave}
          onClose={() => {
            setShowEditor(false);
            setEditingThemeId(null);
            setEditorConfig(null);
          }}
        />
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-[92%] max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="relative bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] p-7 text-white text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Upgrade Your Plan
              </h2>

              <p className="text-sm opacity-90 mt-2">
                Unlock powerful restaurant management tools
              </p>
            </div>

            <div className="p-6 space-y-5 text-center">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  You are currently on <span className="font-semibold text-[#1E88E5]">Free Access</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upgrade to continue using premium features without limits
                </p>
              </div>

              <div className="text-left bg-gray-50 p-5 rounded-xl space-y-3 text-sm">
                <p className="font-semibold text-gray-800 mb-2">✨ What you unlock:</p>
                <div className="space-y-2 text-gray-600">
                  <p>🚀 Unlimited menu & category management</p>
                  <p>📊 Advanced analytics & reports</p>
                  <p>📱 Instant QR code generation</p>
                  <p>🎨 Full theme customization</p>
                  <p>⚡ Priority performance & support</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  className="w-full bg-gradient-to-r from-[#1E88E5] to-[#1976D2] hover:opacity-95 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                  onClick={() => {
                    setShowPopup(false);
                    window.location.href = "/subscription";
                  }}
                >
                  View Plans & Upgrade
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPopup(false)}
                >
                  Continue with limited access
                </Button>
              </div>

              <p className="text-[11px] text-gray-400 mt-2">
                Secure payments • Cancel anytime • Instant activation
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

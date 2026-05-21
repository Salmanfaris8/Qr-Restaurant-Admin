import React, { useEffect, useMemo, useRef, useState } from "react";
import { Save, X, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  TemplateConfig,
  cloneConfig,
  getLiveEditorConfig,
  stringifyLiveEditorConfig,
} from "./Templateconfig";

interface TemplateEditorProps {
  config: TemplateConfig;
  renderPreview: (config: TemplateConfig) => React.ReactNode;
  onSave: (config: TemplateConfig) => void;
  onClose: () => void;
}

export function TemplateEditor({
  config: initialConfig,
  renderPreview,
  onSave,
  onClose,
}: TemplateEditorProps) {
  const [config, setConfig] = useState<TemplateConfig>(() => cloneConfig(initialConfig));
  const [activeTab, setActiveTab] = useState<"header" | "menu" | "footer" | "colors">("header");
  const [copied, setCopied] = useState(false);
  const jsonPreRef = useRef<HTMLPreElement>(null);

  const liveJson = useMemo(() => stringifyLiveEditorConfig(config), [config]);

  useEffect(() => {
    console.log("LIVE TEMPLATE JSON", getLiveEditorConfig(config));
  }, [config]);

  useEffect(() => {
    jsonPreRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [config.updatedAt]);

  const touch = (prev: TemplateConfig): TemplateConfig => ({
    ...prev,
    updatedAt: new Date().toISOString(),
  });

  const updateConfig = (updates: Partial<TemplateConfig>) => {
    setConfig((prev) => touch({ ...prev, ...updates }));
  };

  const updateHeaderSection = (
    updates: Partial<NonNullable<TemplateConfig["headerSection"]>>
  ) => {
    setConfig((prev) => {
      const current = prev.headerSection ?? {
        alignment: "start" as const,
        typography: {
          headingFontSize: 32,
          contentFontSize: 16,
          headingFontWeight: 700 as const,
          contentFontWeight: 400 as const,
        },
      };
      return touch({
        ...prev,
        headerSection: {
          ...current,
          ...updates,
          typography: updates.typography
            ? { ...current.typography, ...updates.typography }
            : current.typography,
        },
      });
    });
  };

  const updateMenuSection = (
    updates: Partial<NonNullable<TemplateConfig["menuSection"]>>
  ) => {
    setConfig((prev) => {
      const current = prev.menuSection ?? {
        layout: {
          headerAlignment: "start" as const,
          contentAlignment: "start" as const,
          imagePosition: "right" as const,
          contentPosition: "left" as const,
          gap: 24,
        },
        typography: {
          headingFontSize: 24,
          contentFontSize: 14,
          headingFontWeight: 700 as const,
          contentFontWeight: 400 as const,
        },
      };
      return touch({
        ...prev,
        menuSection: {
          ...current,
          ...updates,
          layout: updates.layout
            ? { ...current.layout, ...updates.layout }
            : current.layout,
          typography: updates.typography
            ? { ...current.typography, ...updates.typography }
            : current.typography,
        },
      });
    });
  };

  const updateFooter = (updates: Partial<NonNullable<TemplateConfig["footer"]>>) => {
    setConfig((prev) => {
      const current = prev.footer ?? {
        headingAlignment: "center" as const,
        addressAlignment: "center" as const,
        iconsAlignment: "center" as const,
        headingFontSize: 18,
        addressFontSize: 12,
        spacing: 16,
      };
      return touch({
        ...prev,
        footer: { ...current, ...updates },
      });
    });
  };

  const swapMenuLayout = () => {
    if (config.menuSection?.layout) {
      const newLayout = {
        ...config.menuSection.layout,
        imagePosition:
          config.menuSection.layout.imagePosition === "left"
            ? "right"
            : config.menuSection.layout.imagePosition === "right"
            ? "left"
            : "left",
        contentPosition:
          config.menuSection.layout.contentPosition === "left"
            ? "right"
            : "left",
      };
      updateMenuSection({ layout: newLayout });
    }
  };

  const exportJSON = () => {
    navigator.clipboard.writeText(liveJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Template Editor</h1>
            <p className="text-sm text-gray-500 mt-1">
              Edit header, menu layout, footer, and typography
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex gap-6 p-6">
          {/* Left: Preview */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Live Preview</h3>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg overflow-auto p-4">
              <div className="inline-block w-full">
                {renderPreview(config)}
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="w-96 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white sticky top-0">
              {["header", "menu", "footer", "colors"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 px-3 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab === "header" && "📋 Header"}
                  {tab === "menu" && "🍽️ Menu"}
                  {tab === "footer" && "👣 Footer"}
                  {tab === "colors" && "🎨 Colors"}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Header Tab */}
              {activeTab === "header" && config.headerSection && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Header Alignment
                    </label>
                    <div className="flex gap-2">
                      {(["start", "center", "end"] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() =>
                            updateHeaderSection({
                              alignment: align,
                            })
                          }
                          className={`flex-1 py-2 text-xs font-bold rounded transition ${
                            config.headerSection.alignment === align
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {align === "start" && "⬅️ Start"}
                          {align === "center" && "⬆️ Center"}
                          {align === "end" && "➡️ End"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Heading Font Size: {config.headerSection.typography.headingFontSize}px
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="64"
                      value={config.headerSection.typography.headingFontSize}
                      onChange={(e) =>
                        updateHeaderSection({
                          typography: {
                            ...config.headerSection.typography,
                            headingFontSize: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Content Font Size: {config.headerSection.typography.contentFontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={config.headerSection.typography.contentFontSize}
                      onChange={(e) =>
                        updateHeaderSection({
                          typography: {
                            ...config.headerSection.typography,
                            contentFontSize: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Menu Tab */}
              {activeTab === "menu" && config.menuSection && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Section Title Alignment
                    </label>
                    <div className="flex gap-2">
                      {(["start", "center", "end"] as const).map((align) => (
                        <button
                          key={`section-title-${align}`}
                          type="button"
                          onClick={() =>
                            updateMenuSection({
                              layout: {
                                ...config.menuSection!.layout,
                                headerAlignment: align,
                              },
                            })
                          }
                          className={`flex-1 py-2 text-xs font-bold rounded transition ${
                            config.menuSection.layout.headerAlignment === align
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {align === "start" && "⬅️"}
                          {align === "center" && "⬆️"}
                          {align === "end" && "➡️"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Layout
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateMenuSection({
                            layout: {
                              ...config.menuSection!.layout,
                              contentPosition: "left",
                              imagePosition: "right",
                            },
                          })
                        }
                        className={`py-2 px-3 text-xs rounded border transition ${
                          config.menuSection.layout.contentPosition === "left"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        📝 Left Content
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateMenuSection({
                            layout: {
                              ...config.menuSection!.layout,
                              contentPosition: "right",
                              imagePosition: "left",
                            },
                          })
                        }
                        className={`py-2 px-3 text-xs rounded border transition ${
                          config.menuSection.layout.contentPosition === "right"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        📝 Right Content
                      </button>
                      <button
                        type="button"
                        onClick={swapMenuLayout}
                        className="py-2 px-3 text-xs rounded border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-1 col-span-2"
                      >
                        <ArrowRight className="w-3 h-3" />
                        Swap sides
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Content Alignment
                    </label>
                    <div className="flex gap-2">
                      {(["start", "center", "end"] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() =>
                            updateMenuSection({
                              layout: {
                                ...config.menuSection.layout,
                                contentAlignment: align,
                              },
                            })
                          }
                          className={`flex-1 py-2 text-xs font-bold rounded transition ${
                            config.menuSection.layout.contentAlignment === align
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {align === "start" && "⬅️"}
                          {align === "center" && "⬆️"}
                          {align === "end" && "➡️"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Menu Columns: {config.layout.menuColumns}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={config.layout.menuColumns}
                      onChange={(e) =>
                        updateConfig({
                          layout: {
                            ...config.layout,
                            menuColumns: Number(e.target.value) as any,
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Heading Font Size: {config.menuSection.typography.headingFontSize}px
                    </label>
                    <input
                      type="range"
                      min="14"
                      max="48"
                      value={config.menuSection.typography.headingFontSize}
                      onChange={(e) =>
                        updateMenuSection({
                          typography: {
                            ...config.menuSection.typography,
                            headingFontSize: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Content Font Size: {config.menuSection.typography.contentFontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={config.menuSection.typography.contentFontSize}
                      onChange={(e) =>
                        updateMenuSection({
                          typography: {
                            ...config.menuSection.typography,
                            contentFontSize: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Gap: {config.menuSection.layout.gap}px
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      value={config.menuSection.layout.gap}
                      onChange={(e) =>
                        updateMenuSection({
                          layout: {
                            ...config.menuSection.layout,
                            gap: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Footer Tab */}
              {activeTab === "footer" && config.footer && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Heading Alignment
                    </label>
                    <div className="flex gap-2">
                      {(["start", "center", "end"] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => updateFooter({ headingAlignment: align })}
                          className={`flex-1 py-2 text-xs font-bold rounded transition ${
                            config.footer.headingAlignment === align
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {align === "start" && "⬅️"}
                          {align === "center" && "⬆️"}
                          {align === "end" && "➡️"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Address Alignment
                    </label>
                    <div className="flex gap-2">
                      {(["start", "center", "end"] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => updateFooter({ addressAlignment: align })}
                          className={`flex-1 py-2 text-xs font-bold rounded transition ${
                            config.footer.addressAlignment === align
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {align === "start" && "⬅️"}
                          {align === "center" && "⬆️"}
                          {align === "end" && "➡️"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Icons Alignment
                    </label>
                    <div className="flex gap-2">
                      {(["start", "center", "end"] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => updateFooter({ iconsAlignment: align })}
                          className={`flex-1 py-2 text-xs font-bold rounded transition ${
                            config.footer.iconsAlignment === align
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {align === "start" && "⬅️"}
                          {align === "center" && "⬆️"}
                          {align === "end" && "➡️"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Heading Font Size: {config.footer.headingFontSize}px
                    </label>
                    <input
                      type="range"
                      min="14"
                      max="32"
                      value={config.footer.headingFontSize}
                      onChange={(e) =>
                        updateFooter({
                          headingFontSize: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Address Font Size: {config.footer.addressFontSize}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={config.footer.addressFontSize}
                      onChange={(e) =>
                        updateFooter({
                          addressFontSize: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Spacing: {config.footer.spacing}px
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={config.footer.spacing}
                      onChange={(e) =>
                        updateFooter({
                          spacing: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Colors Tab */}
              {activeTab === "colors" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                        className="flex-1 px-2 py-2 text-xs border border-gray-200 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Accent Color
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => updateConfig({ accentColor: e.target.value })}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={config.accentColor}
                        onChange={(e) => updateConfig({ accentColor: e.target.value })}
                        className="flex-1 px-2 py-2 text-xs border border-gray-200 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Background Color
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={config.backgroundColor}
                        onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                        className="flex-1 px-2 py-2 text-xs border border-gray-200 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Card Style
                    </label>
                    <div className="flex gap-2">
                      {(["flat", "bordered", "elevated"] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() =>
                            updateConfig({
                              layout: {
                                ...config.layout,
                                cardStyle: style,
                              },
                            })
                          }
                          className={`flex-1 py-2 text-xs font-bold rounded transition ${
                            config.layout.cardStyle === style
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.layout.showDividers}
                        onChange={(e) =>
                          updateConfig({
                            layout: {
                              ...config.layout,
                              showDividers: e.target.checked,
                            },
                          })
                        }
                      />
                      Show Dividers
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.layout.showPriceTag}
                        onChange={(e) =>
                          updateConfig({
                            layout: {
                              ...config.layout,
                              showPriceTag: e.target.checked,
                            },
                          })
                        }
                      />
                      Show Price Tags
                    </label>
                  </div>

                  <button
                    onClick={exportJSON}
                    className="w-full mt-4 py-2 px-3 text-xs font-bold bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    {copied ? "✓ JSON Copied!" : "📋 Copy JSON"}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-auto max-h-0 hidden border border-gray-700">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div>
                <h3 className="text-xs font-bold text-green-400">Live JSON</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  header: {config.headerSection?.alignment ?? "—"} · menu:{" "}
                  {config.menuSection?.layout.headerAlignment ?? "—"} ·{" "}
                  {new Date(config.updatedAt).toLocaleTimeString()}
                </p>
              </div>

              <button
              type="button"
                onClick={exportJSON}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>

            <pre
              ref={jsonPreRef}
              key={config.updatedAt}
              className="text-xs text-green-300 whitespace-pre-wrap break-words font-mono"
            >
              {liveJson}
            </pre>
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(config)}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Save className="w-4 h-4" />
            Save Template
          </Button>
        </div>
      </div>
    </div>
  );
}
/** Maps editor alignment values to CSS text-align */
export function alignToTextAlign(
  align: "start" | "center" | "end" = "start"
): "left" | "center" | "right" {
  if (align === "center") return "center";
  if (align === "end") return "right";
  return "left";
}

/** Maps editor alignment values to flex justify / align-items */
export function alignToFlex(align: "start" | "center" | "end" = "start"): string {
  if (align === "center") return "center";
  if (align === "end") return "flex-end";
  return "flex-start";
}

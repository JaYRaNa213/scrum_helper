export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export function escapeHtml(str) {
  if (str == null) return "";

  return (
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
  );
}

export const compactTextStyle =
  "display: inline-block; padding: 0 8px; margin: 0; line-height: 1.2;";

export function wrapCompactText(content) {
  const safeContent = escapeHtml(content);
  return `<span style="${compactTextStyle}">${safeContent}</span>`;
}

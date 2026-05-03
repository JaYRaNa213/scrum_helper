import { formatDate, escapeHtml } from "./utils.js";
//SCM flow test -> Provider (github) - > render ui -> renderNormalizedScrum
export function renderNormalizedScrum(data, { startDate, endDate }) {
  const container = document.getElementById("scrumReport");

  if (!container) return;

  if (!data || !data.length) {
    container.innerHTML = "<p>No activity found</p>";
    return;
  }

  // Section 1: Activities
  let content = `<b>1. What did I do from ${formatDate(startDate)} to ${formatDate(endDate)}?</b><br><ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">`;

  const html = data
    .map((item) => {
      const typeLabel = item.type === "pull_request" ? "PR" : "Issue";
      const statusHtml = getStatusLabel(item.state, item.type);
      const displayId = item.number || item.id;

      return `<li style="margin-bottom: 4px;"><i>(${item.repo})</i> - Updated ${typeLabel} (<a href="${item.url}" target="_blank" style="color: #2563eb; text-decoration: none;">#${displayId}</a>) - ${escapeHtml(item.title)} ${statusHtml}</li>`;
    })
    .join("");

  content += html + "</ul>";

  // Section 2: Plans
  content += `<b>2. What do I plan to do today?</b><br>
    <p style="margin-left: 20px; color: #4b5563; margin-top: 5px; margin-bottom: 10px;">No plans added yet.</p>`;

  // Section 3: Blockers
  content += `<b>3. What is blocking me from making progress?</b><br>
    <p style="margin-left: 20px; color: #4b5563; margin-top: 5px;">No Blocker at the moment</p>`;

  container.innerHTML = content;
}

export function getStatusLabel(state, type) {
  let color = "#808080"; // default gray
  let label = state || "open";

  if (state === "open") color = "#2cbe4e";
  else if (state === "closed" || state === "closed (not planned)")
    color = "#d73a49";
  else if (state === "merged" || state === "closed (completed)")
    color = "#6f42c1";
  else if (state === "draft") color = "#808080";

  return `<div style="vertical-align:middle;display: inline-block;padding: 0px 4px;font-size:9px;font-weight: 600;color: #fff;text-align: center;background-color: ${color};border-radius: 3px;line-height: 12px;margin-bottom: 2px;">${label}</div>`;
}

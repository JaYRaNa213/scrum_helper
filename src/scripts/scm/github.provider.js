import { ISCMProvider } from "./scm.interface.js";
import { createNormalizedItem } from "../models/normalized.model.js";
// SCM flow test
export class GitHubProvider extends ISCMProvider {
  constructor(config) {
    super();
    this.token = config.token;
    this.username = config.username;
  }

  async fetchActivity({ startDate, endDate }) {
    const url = `https://api.github.com/search/issues?q=author:${this.username}+updated:${startDate}..${endDate}`;

    const res = await fetch(url, {
      headers: {
        Authorization: this.token ? `token ${this.token}` : undefined,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `GitHub API error: ${res.status}`);
    }

    return (data.items || []).map((item) => this.normalize(item));
  }

  normalize(item) {
    return createNormalizedItem({
      id: item.id,
      number: item.number ?? null,
      title: item.title,
      type: item.pull_request ? "pull_request" : "issue",
      state: this.normalizeState(item),
      repo: item.repository_url?.split("/").slice(-1)[0],
      url: item.html_url,
      updatedAt: item.updated_at,
      source: "github",
    });
  }
  normalizeState(item) {
    // PR specific logic
    if (item.pull_request) {
      if (item.state === "closed" && item.pull_request?.merged_at) {
        return "merged";
      }
    }

    // default mapping
    if (item.state === "open") return "open";
    if (item.state === "closed") return "closed";

    return item.state || "open";
  }
}

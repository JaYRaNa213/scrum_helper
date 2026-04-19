import { ISCMProvider } from "./scm.interface.js";
import { createNormalizedItem } from "../models/normalized.model.js";

export class GitLabProvider extends ISCMProvider {
  constructor(config) {
    super();
    this.token = config.token;
    this.baseUrl = config.baseUrl || "https://gitlab.com/api/v4";
  }

  async fetchActivity({ startDate, endDate }) {
    const headers = {
      "PRIVATE-TOKEN": this.token,
    };

    const projectsRes = await fetch(`${this.baseUrl}/projects`, { headers });
    const projects = await projectsRes.json();

    let results = [];

    for (const project of projects.slice(0, 5)) {
      //  FETCH ISSUES
      const issuesRes = await fetch(
        `${this.baseUrl}/projects/${project.id}/issues?updated_after=${startDate}`,
        { headers },
      );

      const issues = await issuesRes.json();

      results.push(
        ...issues.map((issue) =>
          createNormalizedItem({
            id: issue.id,
            number: issue.iid,
            title: issue.title,
            type: "issue",
            state: this.normalizeState(issue.state),
            repo: project.name,
            url: issue.web_url,
            updatedAt: issue.updated_at,
            source: "gitlab",
          }),
        ),
      );

      //  FETCH MERGE REQUESTS (PR equivalent)
      const mrRes = await fetch(
        `${this.baseUrl}/projects/${project.id}/merge_requests?updated_after=${startDate}`,
        { headers },
      );

      const mrs = await mrRes.json();

      results.push(
        ...mrs.map((mr) =>
          createNormalizedItem({
            id: mr.id,
            number: mr.iid,
            title: mr.title,
            type: "pull_request",
            state: this.normalizeMRState(mr),
            repo: project.name,
            url: mr.web_url,
            updatedAt: mr.updated_at,
            source: "gitlab",
          }),
        ),
      );
    }

    return results;
  }

  //  Normalize issue state
  normalizeState(state) {
    if (state === "opened") return "open";
    if (state === "closed") return "closed";
    return "open";
  }

  //  Normalize MR state (important)
  normalizeMRState(mr) {
    if (mr.merged_at) return "merged";
    if (mr.state === "opened") return "open";
    if (mr.state === "closed") return "closed";
    return "open";
  }
}

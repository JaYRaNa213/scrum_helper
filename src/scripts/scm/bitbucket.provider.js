import { ISCMProvider } from "./scm.interface.js";
import { createNormalizedItem } from "../models/normalized.model.js";

export class BitbucketProvider extends ISCMProvider {
  constructor(config) {
    super();
    this.token = config.token;
    this.username = config.username;
    this.baseUrl = "https://api.bitbucket.org/2.0";
  }

  async fetchActivity({ startDate, endDate }) {
    const headers = {
      Authorization: this.token ? `Bearer ${this.token}` : undefined,
    };

    let results = [];

    //  STEP 1: Fetch repositories (Bitbucket uses repos, not projects)
    const repoRes = await fetch(
      `${this.baseUrl}/repositories/${this.username}`,
      { headers }
    );

    const repoData = await repoRes.json();
    const repos = repoData.values || [];

    for (const repo of repos.slice(0, 5)) {
      const repoSlug = repo.slug;

      //  STEP 2: Fetch Pull Requests
      const prRes = await fetch(
        `${this.baseUrl}/repositories/${this.username}/${repoSlug}/pullrequests?q=updated_on>=${startDate}`,
        { headers }
      );

      const prData = await prRes.json();
      const prs = prData.values || [];

      results.push(
        ...prs.map((pr) =>
          createNormalizedItem({
            id: pr.id,
            number: pr.id,
            title: pr.title,
            type: "pull_request",
            state: this.normalizePRState(pr),
            repo: repo.name,
            url: pr.links?.html?.href,
            updatedAt: pr.updated_on,
            source: "bitbucket",
          })
        )
      );

      //  STEP 3: Fetch Issues (if enabled in repo)
      const issueRes = await fetch(
        `${this.baseUrl}/repositories/${this.username}/${repoSlug}/issues?q=updated_on>=${startDate}`,
        { headers }
      );

      const issueData = await issueRes.json();
      const issues = issueData.values || [];

      results.push(
        ...issues.map((issue) =>
          createNormalizedItem({
            id: issue.id,
            number: issue.id,
            title: issue.title,
            type: "issue",
            state: this.normalizeIssueState(issue.state),
            repo: repo.name,
            url: issue.links?.html?.href,
            updatedAt: issue.updated_on,
            source: "bitbucket",
          })
        )
      );
    }

    return results;
  }

  //  Normalize PR state
  normalizePRState(pr) {
    if (pr.state === "MERGED") return "merged";
    if (pr.state === "OPEN") return "open";
    if (pr.state === "DECLINED") return "closed";

    return "open";
  }

  //  Normalize Issue state
  normalizeIssueState(state) {
    if (state === "new" || state === "open") return "open";
    if (state === "resolved" || state === "closed") return "closed";

    return "open";
  }
}
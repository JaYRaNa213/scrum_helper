import { GitHubProvider } from "./github.provider.js";
import { GitLabProvider } from "./gitlab.provider.js";
//SCM flow test - > 
export function getProvider(type, config) {
  switch (type) {
    case "github":
      return new GitHubProvider(config);
    case "gitlab":
      return new GitLabProvider(config);
    default:
      throw new Error("Unsupported SCM");
  }
}

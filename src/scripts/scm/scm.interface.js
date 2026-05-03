//it define the provide contract , it is interface 
export class ISCMProvider {
  init(config) {}

  async fetchActivity(params) {
    throw new Error("Not implemented");
  }

  async fetchCommits(repo, prNumber) {}

  async validateToken() {
    return true;
  }
}

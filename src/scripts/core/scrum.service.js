import { getProvider } from "../scm/scm.factory.js";
//SCM flow test - > generateScrumFromProvider-> generateScrum ->getProvider
export async function generateScrum({ platform, config, startDate, endDate }) {
  const provider = getProvider(platform, config);

  const activity = await provider.fetchActivity({ startDate, endDate });

  return activity;
}

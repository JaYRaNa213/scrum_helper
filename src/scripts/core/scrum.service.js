import { getProvider } from "../scm/scm.factory.js";

export async function generateScrum({ platform, config, startDate, endDate }) {
  const provider = getProvider(platform, config);

  const activity = await provider.fetchActivity({ startDate, endDate });

  return activity;
}

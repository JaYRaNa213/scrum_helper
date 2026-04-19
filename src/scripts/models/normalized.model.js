export function createNormalizedItem(item) {
  return {
    id: item.id ?? null,
    number: item.number ?? null,
    title: item.title ?? "",
    type: item.type ?? "issue",
    state: item.state ?? "open",
    repo: item.repo ?? "",
    url: item.url ?? "",
    updatedAt: item.updatedAt ?? null,
    source: item.source ?? "unknown",
  };
}

// export function createNormalizedItem(item) {
//   return {
//     id: item.id,
//     number,
//     title: item.title,
//     type: item.type,
//     state: item.state,
//     repo: item.repo,
//     url: item.url,
//     updatedAt: item.updatedAt,
//     source: item.source || "github",
//   };
// }

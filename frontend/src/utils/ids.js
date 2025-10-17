export const normalizeId = (id) =>
  typeof id === "object" && id?.$oid ? id.$oid : String(id || "");

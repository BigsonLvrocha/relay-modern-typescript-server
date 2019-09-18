export const idToGraphqlId = (id: string, prefix: string) => {
  return `${prefix}-${id}`;
};

export const graphqIdToId = (id: string, prefix: string) => {
  return id.substring(prefix.length);
};

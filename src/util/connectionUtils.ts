export const parseFirstLast = (
  first: number | undefined | null,
  last: number | undefined | null
) => {
  if (!first && !last) {
    first = 10;
  }
  if (first && first > 1000) {
    first = 1000;
  }
  if (last && last > 1000) {
    last = 1000;
  }
  return {
    first,
    last
  };
};

export const calculateOffstetLimit = (
  first: number | undefined | null,
  last: number | undefined | null,
  totalCount: number,
  afterOffset: number,
  beforeOffset: number
) => {
  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = Math.min(totalCount, beforeOffset);
  if (first !== undefined && first !== null) {
    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (last !== undefined && last !== null) {
    startOffset = Math.max(startOffset, endOffset - (last || 0));
  }
  const skip = Math.max(startOffset, 0);
  const safeLimit = Math.max(endOffset - startOffset, 1);
  const limitOffset = Math.max(endOffset - startOffset, 0);
  const endCursorOffset = limitOffset + skip;
  return {
    skip,
    safeLimit,
    limitOffset,
    startOffset,
    endOffset,
    endCursorOffset
  };
};

export const getPageInfo = (
  firstEdge: { cursor: string } | null,
  lastEdge: { cursor: string } | null,
  startOffset: number,
  endCursorOffset: number,
  totalCount: number
): GQL.IPageInfoExtended => ({
  startCursor: firstEdge ? firstEdge.cursor : null,
  endCursor: lastEdge ? lastEdge.cursor : null,
  hasPreviousPage: startOffset > 0,
  hasNextPage: endCursorOffset < totalCount
});

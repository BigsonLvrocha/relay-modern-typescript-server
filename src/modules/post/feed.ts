import { Resolver } from "../../types/graphql-utils";
import { ModelCtor, Op } from "sequelize";
import { Post } from "../../models/Post.model";
import { Post2Edge, cursor2Post } from "../../util/typeMap";

export const feed: Resolver = async (
  _,
  args: GQL.IFeedOnQueryArguments,
  { sequelize }
) => {
  const PostModel = sequelize.models.Post as ModelCtor<Post>;
  const { before, after } = args;
  let { first, last } = args;
  // Limit the maximum number of elements in a query
  if (!first && !last) {
    first = 10;
  }
  if (first && first > 1000) {
    first = 1000;
  }
  if (last && last > 1000) {
    last = 1000;
  }
  const totalCount = await PostModel.count();
  let afterOffset = -1;
  let beforeOffset = totalCount;
  if (after) {
    const nameAfter = cursor2Post(after);
    const countCreatedAtPromise = PostModel.count({
      where: {
        createdAt: {
          [Op.gt]: nameAfter.createdAt
        }
      }
    });
    const countNamePromise = PostModel.count({
      where: {
        createdAt: {
          [Op.eq]: nameAfter.createdAt
        },
        authorId: {
          [Op.lt]: nameAfter.authorId
        }
      }
    });
    const [countAt, countName] = await Promise.all([
      countCreatedAtPromise,
      countNamePromise
    ]);
    afterOffset = countAt + countName;
  }
  if (before) {
    const nameBefore = cursor2Post(before);
    const countCreatedAtPromise = PostModel.count({
      where: {
        createdAt: {
          [Op.gt]: nameBefore.createdAt
        }
      }
    });
    const countNamePromise = await PostModel.count({
      where: {
        createdAt: {
          [Op.eq]: nameBefore.createdAt
        },
        authorId: {
          [Op.lt]: nameBefore.authorId
        }
      }
    });
    const [countAt, countName] = await Promise.all([
      countCreatedAtPromise,
      countNamePromise
    ]);
    beforeOffset = countAt + countName;
  }
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
  const posts = (await PostModel.findAll({
    limit: safeLimit,
    offset: skip,
    order: [["createdAt", "DESC"], ["authorId", "ASC"]]
  })) as Post[];
  const edges = posts.map(post => Post2Edge(post));
  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const pageInfo: GQL.IPageInfoExtended = {
    startCursor: firstEdge ? firstEdge.cursor : null,
    endCursor: lastEdge ? lastEdge.cursor : null,
    hasPreviousPage: startOffset > 0,
    hasNextPage: limitOffset + skip < totalCount
  };
  const result = {
    edges,
    count: edges.length,
    totalCount,
    endCursorOffset: limitOffset + skip,
    startCursorOffset: startOffset,
    pageInfo
  };
  return result;
};

import { Resolver } from "../../../types/graphql-utils";
import { ModelCtor } from "sequelize-typescript";
import { Comment } from "../../../models/Comment.model";
import {
  parseFirstLast,
  calculateOffstetLimit,
  getPageInfo
} from "../../../util/connectionUtils";
import { cursor2Comment, comment2PostAuthorEdge } from "../types/typeMap";
import { Op } from "sequelize";

export const cursor2OffsetWithDefault = async (
  cursor: string | null | undefined,
  defaultValue: number,
  model: ModelCtor<Comment>
): Promise<number> => {
  if (!cursor) {
    return defaultValue;
  }
  const { authorId, postId, createdAt } = cursor2Comment(cursor);
  const countCreatedAtPromise = model.count({
    where: {
      postId,
      createdAt: {
        [Op.lt]: createdAt
      }
    }
  });
  const countSameCreationAtPromise = model.count({
    where: {
      postId,
      createdAt: {
        [Op.eq]: createdAt
      },
      authorId: {
        [Op.lt]: authorId
      }
    }
  });
  const counts = await Promise.all([
    countCreatedAtPromise,
    countSameCreationAtPromise
  ]);
  return counts[0] + counts[1];
};

export const comments: Resolver = async (
  parent: Partial<GQL.IPost>,
  args: GQL.ICommentsOnPostArguments,
  { sequelize }
) => {
  const CommentModel = sequelize.models.Comment as ModelCtor<Comment>;
  const where = { postId: parent._id as string };
  const { first, last } = parseFirstLast(args.first, args.last);
  const { before, after } = args;
  const totalCount = await CommentModel.count({ where });
  const afterOffset = await cursor2OffsetWithDefault(after, -1, CommentModel);
  const beforeOffset = await cursor2OffsetWithDefault(
    before,
    totalCount,
    CommentModel
  );
  const {
    safeLimit,
    skip,
    startOffset,
    endCursorOffset
  } = calculateOffstetLimit(first, last, totalCount, afterOffset, beforeOffset);
  const commentList = (await CommentModel.findAll({
    limit: safeLimit,
    offset: skip,
    order: [["createdAt", "ASC"], ["authorId", "ASC"]],
    where
  })) as Comment[];
  const edges = commentList.map(post => comment2PostAuthorEdge(post));
  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const pageInfo = getPageInfo(
    firstEdge,
    lastEdge,
    startOffset,
    endCursorOffset,
    totalCount
  );
  const result = {
    edges,
    count: edges.length,
    totalCount,
    endCursorOffset,
    startCursorOffset: startOffset,
    pageInfo
  };
  return result;
};

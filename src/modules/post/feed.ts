import { Resolver } from "../../types/graphql-utils";
import { ModelCtor, Op } from "sequelize";
import { Post } from "../../models/Post.model";
import { Post2Edge, cursor2Post } from "../../util/typeMap";
import {
  parseFirstLast,
  calculateOffstetLimit,
  getPageInfo
} from "../../util/connectionUtils";

const cursor2OffsetWithDefault = async (
  after: string | null | undefined,
  defaultValue: number,
  PostModel: ModelCtor<Post>
): Promise<number> => {
  if (!after) {
    return defaultValue;
  }
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
  return countAt + countName;
};

export const feed: Resolver = async (
  _,
  args: GQL.IFeedOnQueryArguments,
  { sequelize }
) => {
  const PostModel = sequelize.models.Post as ModelCtor<Post>;
  const { before, after } = args;
  const { first, last } = parseFirstLast(args.first, args.last);
  const totalCount = await PostModel.count();
  const afterOffset = await cursor2OffsetWithDefault(after, -1, PostModel);
  const beforeOffset = await cursor2OffsetWithDefault(
    before,
    totalCount,
    PostModel
  );
  const {
    safeLimit,
    skip,
    startOffset,
    endCursorOffset
  } = calculateOffstetLimit(first, last, totalCount, afterOffset, beforeOffset);
  const posts = (await PostModel.findAll({
    limit: safeLimit,
    offset: skip,
    order: [["createdAt", "DESC"], ["authorId", "ASC"]]
  })) as Post[];
  const edges = posts.map(post => Post2Edge(post));
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

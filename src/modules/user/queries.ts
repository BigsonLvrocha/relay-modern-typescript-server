import { Resolver } from "../../types/graphql-utils";
import { applyMiddleware } from "../../util/applyMiddleware";
import { authGraphqlMiddleware } from "../middleware/auth";
import { User } from "../../models/User.model";
import { UserToIUser, cursor2String, UserToEdge } from "../../util/typeMap";
import { graphqIdToId } from "../../util/graphqlId";
import { ModelCtor } from "sequelize-typescript";
import { Op } from "sequelize";

export const userResolver: Resolver = async (
  _,
  { id: graphId }: GQL.IUserOnQueryArguments,
  { sequelize }
): Promise<GQL.IUser | null> => {
  const id = graphqIdToId(graphId, "user");
  const user = (await sequelize.models.User.findByPk(id)) as User;
  if (!user) {
    return null;
  }
  return UserToIUser(user);
};

export const meResolver: Resolver = applyMiddleware(
  authGraphqlMiddleware,
  async (_, __, { userId, sequelize }): Promise<GQL.IUser | null> => {
    if (!userId) {
      return null;
    }
    const UserModel = sequelize.models.User;
    const me = (await UserModel.findByPk(userId)) as User;
    return UserToIUser(me);
  },
  { throwError: false }
);

export const usersResolver: Resolver = async (
  _,
  args: GQL.IUsersOnQueryArguments,
  { sequelize }
): Promise<GQL.IUserConnection | null> => {
  const UserModel = sequelize.models.User as ModelCtor<User>;
  const { before, after, search } = args;
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
  let total = 0;
  let where = {};
  if (search) {
    where = {
      [Op.or]: [
        {
          name: {
            [Op.iLike]: `%${search}%`
          }
        },
        {
          email: {
            [Op.iLike]: `%${search}%`
          }
        }
      ]
    };
  }
  total = await UserModel.count({ where });
  let afterOffset = -1;
  let beforeOffset = total;
  if (after) {
    const nameAfter = cursor2String(after, "user-name-");
    afterOffset = await UserModel.count({
      where: {
        name: {
          [Op.lt]: nameAfter
        },
        ...where
      }
    });
  }
  if (before) {
    const nameBefore = cursor2String(before, "user-name-");
    beforeOffset = await UserModel.count({
      where: {
        name: {
          [Op.lt]: nameBefore
        },
        ...where
      }
    });
  }
  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = Math.min(total, beforeOffset);
  if (first !== undefined && first !== null) {
    endOffset = Math.min(endOffset, startOffset + first);
  }

  if (last !== undefined && last !== null) {
    startOffset = Math.max(startOffset, endOffset - (last || 0));
  }
  const skip = Math.max(startOffset, 0);
  const safeLimit = Math.max(endOffset - startOffset, 1);
  const limitOffset = Math.max(endOffset - startOffset, 0);
  const users = (await UserModel.findAll({
    limit: safeLimit,
    offset: skip,
    where,
    order: [["name", "ASC"]]
  })) as User[];
  const edges = users.map(user => UserToEdge(user));
  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const pageInfo: GQL.IPageInfoExtended = {
    startCursor: firstEdge ? firstEdge.cursor : null,
    endCursor: lastEdge ? lastEdge.cursor : null,
    hasPreviousPage: startOffset > 0,
    hasNextPage: limitOffset + skip < total,
    __typename: "PageInfoExtended"
    // hasPreviousPage: last !== null ? startOffset > lowerBound : false,
    // hasNextPage: first !== null ? endOffset < upperBound : false,
  };
  return {
    __typename: "UserConnection",
    edges,
    count: edges.length,
    totalCount: total,
    endCursorOffset: limitOffset + skip,
    startCursorOffset: startOffset,
    pageInfo
  };
};

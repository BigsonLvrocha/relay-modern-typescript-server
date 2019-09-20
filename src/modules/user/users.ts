import { Resolver } from "../../types/graphql-utils";
import { ModelCtor } from "sequelize-typescript";
import { User } from "../../models/User.model";
import { Op } from "sequelize";
import { cursor2String, UserToEdge } from "../../util/typeMap";
import {
  parseFirstLast,
  calculateOffstetLimit,
  getPageInfo
} from "../../util/connectionUtils";

export const cursor2Offset = (
  cursor: string | null | undefined,
  defaultValue: number,
  search: any,
  UserModel: ModelCtor<User>
) => {
  if (!cursor) {
    return defaultValue;
  }
  const nameAfter = cursor2String(cursor, "user-name-");
  return UserModel.count({
    where: {
      name: {
        [Op.lt]: nameAfter
      },
      ...search
    }
  });
};

export const usersResolver: Resolver = async (
  _,
  args: GQL.IUsersOnQueryArguments,
  { sequelize }
): Promise<GQL.IUserConnection | null> => {
  const UserModel = sequelize.models.User as ModelCtor<User>;
  const { before, after, search } = args;
  const { first, last } = parseFirstLast(args.first, args.last);
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
  const afterOffset = await cursor2Offset(after, -1, where, UserModel);
  const beforeOffset = await cursor2Offset(before, total, where, UserModel);
  const {
    endCursorOffset,
    limitOffset,
    safeLimit,
    startOffset,
    skip
  } = calculateOffstetLimit(first, last, total, afterOffset, beforeOffset);
  const users = (await UserModel.findAll({
    limit: safeLimit,
    offset: skip,
    where,
    order: [["name", "ASC"]]
  })) as User[];
  const edges = users.map(user => UserToEdge(user));
  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const pageInfo = getPageInfo(
    firstEdge,
    lastEdge,
    startOffset,
    endCursorOffset,
    total
  );
  return {
    edges,
    count: edges.length,
    totalCount: total,
    endCursorOffset: limitOffset + skip,
    startCursorOffset: startOffset,
    pageInfo
  };
};

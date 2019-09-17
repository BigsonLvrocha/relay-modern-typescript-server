import { Resolver } from "../../types/graphql-utils";
import { applyMiddleware } from "../../util/applyMiddleware";
import { authGraphqlMiddleware } from "../middleware/auth";
import { User } from "../../models/User.model";
import { UserToIUser } from "../../util/typeMap";

export const userResolver: Resolver = async (
  _,
  {  }: GQL.IUserOnQueryArguments
): Promise<GQL.IUser | null> => null;

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
  {  }: GQL.IUsersOnQueryArguments
): Promise<GQL.IUserConnection | null> => null;

import { Resolver } from "../../../types/graphql-utils";
import { applyMiddleware } from "../../../util/applyMiddleware";
import { authGraphqlMiddleware } from "../../middleware/auth";
import { User } from "../../../models/User.model";
import { UserToIUser } from "../../../util/typeMap";
import { graphqIdToId } from "../../../util/graphqlId";

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

import { ResolverMap } from "../../types/graphql-utils";
import { ModelCtor } from "sequelize-typescript";
import { User } from "../../models/User.model";
import { UserToIUser } from "../../util/typeMap";
import { Op } from "sequelize";

export const resolvers: ResolverMap = {
  Query: {
    randomUser: async (_, __, { sequelize }) => {
      const UserModel = sequelize.models.User as ModelCtor<User>;
      const user = (await UserModel.findOne({
        where: { name: { [Op.iLike]: "%a%" } }
      })) as User;
      return UserToIUser(user);
    }
  }
};

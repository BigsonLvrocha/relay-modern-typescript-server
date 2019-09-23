import { Resolver } from "../../../types/graphql-utils";
import { ModelCtor } from "sequelize-typescript";
import { User } from "../../../models/User.model";
import { user2IUser } from "../../user/types/typeMap";

export const author: Resolver = async (
  obj: Partial<GQL.IComment>,
  _,
  { sequelize }
) => {
  const UserModel = sequelize.models.User as ModelCtor<User>;
  const user = (await UserModel.findByPk(obj.authorId)) as User;
  return user2IUser(user);
};

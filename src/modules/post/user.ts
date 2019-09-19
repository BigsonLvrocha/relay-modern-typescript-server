import { Resolver } from "../../types/graphql-utils";
import { ModelCtor } from "sequelize/types";
import { User } from "../../models/User.model";
import { UserToIUser } from "../../util/typeMap";

export const PostUser: Resolver = async (
  parent,
  _,
  __,
  { sequelize }
): Promise<Partial<GQL.IUser>> => {
  const UserModel = sequelize.models.User as ModelCtor<User>;
  const user = (await UserModel.findByPk(parent._id)) as User;
  return UserToIUser(user);
};

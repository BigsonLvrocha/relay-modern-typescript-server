import { Resolver } from "../../../types/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "../../../models/User.model";
import { invalidAuthentication } from "../../middleware/errorMessages";
import { user2IUser } from "../../../modules/user/types/typeMap";
import { applyMiddleware } from "../../../util/applyMiddleware";
import { authGraphqlMiddleware } from "../../middleware/auth";

const changePasswordResolver: Resolver = async (
  _,
  {
    input: { clientMutationId, oldPassword, password }
  }: GQL.IUserChangePasswordOnMutationArguments,
  { sequelize, userId }
) => {
  const UserModel = sequelize.models.User;
  const user = (await UserModel.findByPk(userId)) as User;
  if (!user) {
    return {
      clientMutationId: clientMutationId || null,
      me: null,
      error: invalidAuthentication
    };
  }
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) {
    return {
      clientMutationId: clientMutationId || null,
      me: null,
      error: invalidAuthentication
    };
  }
  const newPassword = await bcrypt.hash(password, 10);
  await user.update({ password: newPassword });
  return {
    me: user2IUser(user),
    error: null,
    clientMutationId: clientMutationId || null
  };
};

export default applyMiddleware(authGraphqlMiddleware, changePasswordResolver);

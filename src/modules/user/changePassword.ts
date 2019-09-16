import { Resolver } from "../../types/graphql-utils";
import { verifyJwt } from "../../util/verifyJwt";
import * as bcrypt from "bcryptjs";
import { User } from "../../models/User.model";
import { invalidAuthentication } from "./errorMessages";
import { UserToIUser } from "../../util/typeMap";

const changePasswordResolver: Resolver = async (
  _,
  {
    input: { clientMutationId, oldPassword, password }
  }: GQL.IUserChangePasswordOnMutationArguments,
  { request, sequelize }
): Promise<GQL.IUserChangePasswordPayload> => {
  const jwt = await verifyJwt(request);
  if (jwt === null) {
    return {
      __typename: "UserChangePasswordPayload",
      clientMutationId: clientMutationId || null,
      me: null,
      error: invalidAuthentication
    };
  }
  const UserModel = sequelize.models.User;
  const { userId } = jwt;
  const user = (await UserModel.findByPk(userId)) as User;
  if (!user) {
    return {
      __typename: "UserChangePasswordPayload",
      clientMutationId: clientMutationId || null,
      me: null,
      error: invalidAuthentication
    };
  }
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) {
    return {
      __typename: "UserChangePasswordPayload",
      clientMutationId: clientMutationId || null,
      me: null,
      error: invalidAuthentication
    };
  }
  const newPassword = await bcrypt.hash(password, 10);
  await user.update({ password: newPassword });
  return {
    __typename: "UserChangePasswordPayload",
    me: UserToIUser(user),
    error: null,
    clientMutationId: clientMutationId || null
  };
};

export default changePasswordResolver;

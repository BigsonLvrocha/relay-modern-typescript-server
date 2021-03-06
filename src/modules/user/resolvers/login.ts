import { Resolver } from "../../../types/graphql-utils";
import { invalidLogin } from "../types/errorMessages";
import * as bcrypt from "bcryptjs";
import { User } from "../../../models/User.model";
import * as jwt from "jsonwebtoken";
import * as tp from "typed-promisify";

const sign = tp.promisify(jwt.sign);

const loginResolver: Resolver = async (
  _,
  {
    input: { clientMutationId, email, password }
  }: GQL.IUserLoginWithEmailOnMutationArguments,
  { sequelize }
): Promise<GQL.IUserLoginWithEmailPayload> => {
  const UserModel = sequelize.models.User;
  const user = (await UserModel.findOne({ where: { email } })) as User;
  if (!user) {
    return {
      token: null,
      error: invalidLogin,
      clientMutationId: clientMutationId || null
    };
  }
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    const token = (await sign(
      { userId: user._id },
      process.env.APP_SECRET || "secret"
    )) as string;
    return {
      token,
      error: null,
      clientMutationId: clientMutationId || null
    };
  }
  return {
    token: null,
    error: invalidLogin,
    clientMutationId: clientMutationId || null
  };
};

export default loginResolver;

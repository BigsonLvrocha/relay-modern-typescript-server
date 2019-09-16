import * as jwt from "jsonwebtoken";
import { Resolver } from "../../types/graphql-utils";
import { User } from "../../models/User.model";
import * as tp from "typed-promisify";

const sign = tp.promisify(jwt.sign);

const registerResolver: Resolver = async (
  _,
  {
    input: { email, name, password, clientMutationId }
  }: GQL.IUserRegisterWithEmailOnMutationArguments,
  { sequelize }
): Promise<GQL.IUserRegisterWithEmailPayload> => {
  const UserModel = sequelize.models.User;
  const user = (await UserModel.create({
    email,
    password,
    name
  })) as User;
  const token = (await sign({ userId: user._id }, process.env
    .APP_SECRET as string)) as string;
  return {
    __typename: "UserRegisterWithEmailPayload",
    token,
    error: null,
    clientMutationId: clientMutationId as string | null
  };
};

export default registerResolver;

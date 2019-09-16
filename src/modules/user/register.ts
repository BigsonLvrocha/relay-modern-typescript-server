import * as jwt from "jsonwebtoken";
import { Resolver } from "../../types/graphql-utils";
import { User } from "../../models/User.model";

const registerResolver: Resolver = async (
  _,
  {
    input: { email, name, password, clientMutationId }
  }: GQL.IUserRegisterWithEmailOnMutationArguments,
  { sequelize }
): Promise<GQL.IUserRegisterWithEmailPayload> => {
  try {
    const UserModel = sequelize.models.User;
    const user = (await UserModel.create({
      email,
      password,
      name
    })) as User;
    const token = await jwt.sign({ userId: user._id }, process.env
      .APP_SECRET as string);
    return {
      __typename: "UserRegisterWithEmailPayload",
      token,
      error: null,
      clientMutationId: clientMutationId as string | null
    };
  } catch (err) {
    return {
      __typename: "UserRegisterWithEmailPayload",
      token: null,
      error: err.getMessage(),
      clientMutationId: clientMutationId as string | null
    };
  }
};

export default registerResolver;

import * as jwt from "jsonwebtoken";
import { Resolver } from "../../types/graphql-utils";
import { User } from "../../models/User.model";
import * as tp from "typed-promisify";
import { userAddedChannelName } from "../../util/constants";
import { UserToEdge } from "../../util/typeMap";

const sign = tp.promisify(jwt.sign);

const registerResolver: Resolver = async (
  _,
  {
    input: { email, name, password, clientMutationId }
  }: GQL.IUserRegisterWithEmailOnMutationArguments,
  { sequelize, pubsub }
): Promise<GQL.IUserRegisterWithEmailPayload> => {
  const UserModel = sequelize.models.User;
  const user = (await UserModel.create({
    email,
    password,
    name
  })) as User;
  const token = (await sign({ userId: user._id }, process.env
    .APP_SECRET as string)) as string;
  const userAdded: GQL.IUserAddedPayload = {
    __typename: "UserAddedPayload",
    userEdge: UserToEdge(user)
  };
  pubsub.publish(userAddedChannelName, { UserAdded: userAdded });
  return {
    __typename: "UserRegisterWithEmailPayload",
    token,
    error: null,
    clientMutationId: clientMutationId as string | null
  };
};

export default registerResolver;

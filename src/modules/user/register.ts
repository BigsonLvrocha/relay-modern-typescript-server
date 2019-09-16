import { Resolver } from "../../types/graphql-utils";

const registerResolver: Resolver = async (
  _,
  {  }: GQL.IUserRegisterWithEmailOnMutationArguments,
  {}
): Promise<GQL.IUserRegisterWithEmailPayload> => {
  return {
    __typename: "UserRegisterWithEmailPayload",
    token: "123",
    error: null,
    clientMutationId: null
  };
};

export default registerResolver;

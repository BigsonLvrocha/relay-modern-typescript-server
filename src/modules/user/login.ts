import { Resolver } from "../../types/graphql-utils";

const loginResolver: Resolver = async (
  _,
  {  }: GQL.IUserLoginWithEmailOnMutationArguments,
  {}
): Promise<GQL.IUserLoginWithEmailPayload> => {
  return {
    __typename: "UserLoginWithEmailPayload",
    token: null,
    error: null,
    clientMutationId: null
  };
};

export default loginResolver;

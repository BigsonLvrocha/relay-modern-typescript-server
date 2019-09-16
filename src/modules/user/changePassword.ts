import { Resolver } from "../../types/graphql-utils";

const changePasswordResolver: Resolver = async (
  _,
  {  }: GQL.IUserChangePasswordOnMutationArguments,
  {}
): Promise<GQL.IUserChangePasswordPayload> => {
  return {
    __typename: "UserChangePasswordPayload",
    me: null,
    error: null,
    clientMutationId: null
  };
};

export default changePasswordResolver;

import { GraphqlMiddleware } from "../../types/graphql-utils";
import { invalidAuthentication } from "./errorMessages";
import { verifyJwt } from "../../util/verifyJwt";

export const authGraphqlMiddleware: GraphqlMiddleware = async (
  resolver,
  parent,
  args,
  context,
  info
) => {
  const jwt = await verifyJwt(context.request);
  if (jwt === null) {
    throw new Error(invalidAuthentication);
  }
  const { userId } = jwt;
  return resolver(parent, args, { ...context, userId }, info);
};

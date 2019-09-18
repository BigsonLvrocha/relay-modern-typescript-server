import { GraphqlMiddleware } from "../../types/graphql-utils";
import { invalidAuthentication } from "./errorMessages";
import { verifyJwt } from "../../util/verifyJwt";

export const authGraphqlMiddleware: GraphqlMiddleware = async (
  resolver,
  parent,
  args,
  context,
  info,
  params
) => {
  let throwError = true;
  if (params) {
    throwError = params.throwError;
  }
  const jwt = await verifyJwt(context.request);
  if (jwt === null) {
    if (throwError) {
      throw new Error(invalidAuthentication);
    }
    return resolver(parent, args, context, info);
  }
  const { userId } = jwt;
  return resolver(parent, args, { ...context, userId }, info);
};

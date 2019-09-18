import { Resolver, GraphqlMiddleware } from "../types/graphql-utils";

export const applyMiddleware = (
  middleware: GraphqlMiddleware,
  resolver: Resolver
) => (parent: any, args: any, context: any, info: any) =>
  middleware(resolver, parent, args, context, info);

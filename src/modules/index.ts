import { makeExecutableSchema } from "graphql-tools";
import { mergeResolvers } from "merge-graphql-schemas";
import { mergeSchemas } from "./mergeSchemas";
import * as path from "path";
import * as glob from "glob";

export const genSchema = () => {
  const pathToModules = path.join(__dirname);
  const graphqlTypes = mergeSchemas(pathToModules);
  const resolvers = mergeResolvers(
    glob
      .sync(`${pathToModules}/**/resolvers.?s`)
      .map(resolver => require(resolver).resolvers)
  );
  return makeExecutableSchema({
    typeDefs: graphqlTypes,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });
};

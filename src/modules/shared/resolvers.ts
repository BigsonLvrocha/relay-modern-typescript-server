import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
  Query: {
    node: async (
      _: any,
      {  }: GQL.INodeOnQueryArguments
    ): Promise<GQL.INode | null> => null
  }
};

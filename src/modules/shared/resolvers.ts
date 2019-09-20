import { ResolverMap } from "../../types/graphql-utils";
import { AvailableNode2ModelResolvers, AvailableModel } from "./types/typeMaps";

export const resolvers: ResolverMap = {
  Query: {
    node: async (
      _: any,
      { id }: GQL.INodeOnQueryArguments,
      { sequelize }
    ): Promise<any> => {
      const sections = id.split("-");
      const idValue = sections.slice(sections.length - 5).join("-");
      const prefix = sections.slice(0, sections.length - 5).join("-");
      const correctResolver = AvailableNode2ModelResolvers.find(
        resolver => resolver.idPrefix === prefix
      );
      if (!correctResolver) {
        throw Error("type not found");
      }
      const Model = sequelize.models[correctResolver.modelName];
      const item = (await Model.findByPk(idValue)) as AvailableModel;
      if (!item) {
        return null;
      }
      const node = correctResolver.model2Interface(item);
      return {
        ...node,
        resolveType: correctResolver.resolveType
      };
    }
  },
  Node: {
    __resolveType: obj => {
      return obj.resolveType;
    }
  }
};

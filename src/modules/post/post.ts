import { Resolver } from "../../types/graphql-utils";
import { ModelCtor } from "sequelize";
import { Post } from "../../models/Post.model";
import { graphqIdToId } from "../../util/graphqlId";
import { Post2IPost } from "../../util/typeMap";

export const post: Resolver = async (
  _,
  { id: graphId }: GQL.IPostOnQueryArguments,
  { sequelize }
) => {
  const PostModel = sequelize.models.Post as ModelCtor<Post>;
  const id = graphqIdToId(graphId, "post");
  const postA = (await PostModel.findByPk(id)) as Post;
  if (!postA) {
    return null;
  }
  return Post2IPost(postA);
};

import { Resolver } from "../../../types/graphql-utils";
import { ModelCtor } from "sequelize-typescript";
import { Post } from "../../../models/Post.model";
import { post2IPost } from "../../post/types/typeMap";

export const post: Resolver = async (
  obj: Partial<GQL.IComment>,
  _,
  { sequelize }
) => {
  const PostModel = sequelize.models.Post as ModelCtor<Post>;
  const postObj = (await PostModel.findByPk(obj.postId as string)) as Post;
  return post2IPost(postObj);
};

import { Resolver } from "../../../types/graphql-utils";
import { applyMiddleware } from "../../../util/applyMiddleware";
import { authGraphqlMiddleware } from "../../middleware/auth";
import { ModelCtor } from "sequelize";
import { Post } from "../../../models/Post.model";
import { post2IPost } from "../types/typeMap";

export const UserCreatePost: Resolver = applyMiddleware(
  authGraphqlMiddleware,
  async (
    _,
    {
      input: { description, clientMutationId, title }
    }: GQL.IUserCreatePostOnMutationArguments,
    { sequelize, userId }
  ) => {
    const PostModel = sequelize.models.Post as ModelCtor<Post>;
    const post = (await PostModel.create({
      description,
      title,
      authorId: userId
    })) as Post;
    return {
      error: null,
      post: post2IPost(post),
      clientMutationId: clientMutationId || null
    };
  }
);

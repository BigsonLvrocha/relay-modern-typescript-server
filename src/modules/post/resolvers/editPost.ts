import { Resolver } from "../../../types/graphql-utils";
import { applyMiddleware } from "../../../util/applyMiddleware";
import { authGraphqlMiddleware } from "../../middleware/auth";
import { ModelCtor } from "sequelize-typescript";
import { Post } from "../../../models/Post.model";
import { ForbiddenPostEdit } from "../types/errorMessages";
import { graphqIdToId } from "../../../util/graphqlId";
import { idPrefix, post2IPost } from "../types/typeMap";

export const EditPost: Resolver = applyMiddleware(
  authGraphqlMiddleware,
  async (
    _,
    {
      input: { id: graphId, title, clientMutationId }
    }: GQL.IEditPostOnMutationArguments,
    { sequelize, userId }
  ) => {
    const PostModel = sequelize.models.Post as ModelCtor<Post>;
    const id = graphqIdToId(graphId, idPrefix);
    const post = (await PostModel.findByPk(id)) as Post;
    if (post.authorId !== userId) {
      return {
        error: ForbiddenPostEdit,
        post: null,
        clientMutationId: clientMutationId || null
      };
    }
    post.title = title;
    await post.save();
    return {
      error: null,
      post: post2IPost(post),
      clientMutationId: clientMutationId || null
    };
  }
);

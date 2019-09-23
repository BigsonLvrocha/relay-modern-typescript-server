import { Resolver } from "../../../types/graphql-utils";
import { graphqIdToId } from "../../../util/graphqlId";
import { idPrefix } from "../../post/types/typeMap";
import { ModelCtor } from "sequelize-typescript";
import { Comment } from "../../../models/Comment.model";
import { comment2IComment } from "../types/typeMap";
import { applyMiddleware } from "../../../util/applyMiddleware";
import { authGraphqlMiddleware } from "../../middleware/auth";

export const createComment: Resolver = applyMiddleware(
  authGraphqlMiddleware,
  async (
    _,
    {
      input: { comment, postId, clientMutationId }
    }: GQL.ICreateCommentOnMutationArguments,
    { sequelize, userId }
  ) => {
    const id = graphqIdToId(postId, idPrefix);
    const CommentModel = sequelize.models.Comment as ModelCtor<Comment>;
    const commentObj = (await CommentModel.create({
      authorId: userId,
      postId: id,
      comment
    })) as Comment;
    return {
      comment: comment2IComment(commentObj),
      error: null,
      clientMutationId: clientMutationId || null
    };
  }
);

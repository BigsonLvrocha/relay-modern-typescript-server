import { model2Node, Node2ModelResolver } from "../../../types/graphql-utils";
import { Comment } from "../../../models/Comment.model";
import { string2Cursor, cursor2String } from "../../../util/typeMap";
import { idToGraphqlId } from "../../../util/graphqlId";

export const idPrefix = "comment";
export const postCommentCursorPrefix = "post-comment-user-createdAt-";
export const modelName = "Comment";
export const resolveType = "Comment";

export const comment2IComment: model2Node<Comment, GQL.IComment> = comment => ({
  id: idToGraphqlId(comment._id, idPrefix),
  _id: comment._id,
  comment: comment.comment,
  postId: comment.postId,
  authorId: comment.authorId
});

export const comment2PostAuthorEdge = (comment: Comment) => ({
  node: comment2IComment(comment),
  cursor: comment2Cursor(comment)
});

export const comment2Cursor = (comment: Comment) =>
  string2Cursor(
    `${comment.postId}||${
      comment.authorId
    }||${(comment.createdAt as Date).getTime()}`,
    postCommentCursorPrefix
  );

export const cursor2Comment = (cursor: string) => {
  const data = cursor2String(cursor, postCommentCursorPrefix).split("||");
  return {
    createdAt: new Date(Number.parseInt(data[2], 10)),
    postId: data[0],
    authorId: data[1]
  };
};

export const CommentNode2ModelResolver: Node2ModelResolver<
  Comment,
  GQL.IComment
> = {
  idPrefix,
  model2Interface: comment2IComment,
  modelName: "Comment",
  resolveType: "Comment"
};

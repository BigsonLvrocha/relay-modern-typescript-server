import { cursor2String, string2Cursor } from "../../../util/typeMap";
import { Post } from "../../../models/Post.model";
import { idToGraphqlId } from "../../../util/graphqlId";
import { model2Node, Node2ModelResolver } from "../../../types/graphql-utils";

export const idPrefix = "post";
export const cursorPrefix = "post-authorId-createdAt-";
export const modelName = "Post";
export const resolveType = "Post";

export const post2IPost: model2Node<Post, GQL.IPost> = (
  post: Post
): Partial<GQL.IPost> => ({
  _id: post._id,
  id: idToGraphqlId(post._id, idPrefix),
  title: post.title,
  description: post.description,
  authorId: post.authorId
});

export const post2Edge = (post: Post) => ({
  node: post2IPost(post),
  cursor: post2Cursor(post)
});

export const post2Cursor = (post: Post) =>
  string2Cursor(
    `${post.authorId}||${(post.createdAt as Date).getTime()}`,
    cursorPrefix
  );

export const cursor2Post = (cursor: string) => {
  const data = cursor2String(cursor, cursorPrefix).split("||");
  return {
    createdAt: new Date(Number.parseInt(data[1], 10)),
    authorId: data[0]
  };
};

export const PostNode2ModelResolver: Node2ModelResolver<Post, GQL.IPost> = {
  cursorPrefix,
  idPrefix,
  model2Interface: post2IPost,
  modelName,
  resolveType
};

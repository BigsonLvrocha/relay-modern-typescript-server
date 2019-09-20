import { cursor2String, string2Cursor } from "../../../util/typeMap";
import { Post } from "../../../models/Post.model";
import { idToGraphqlId } from "../../../util/graphqlId";

export const post2IPost = (post: Post): Partial<GQL.IPost> => ({
  _id: post._id,
  id: idToGraphqlId(post._id, "post"),
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
    "post-authorId-createdAt-"
  );

export const cursor2Post = (cursor: string) => {
  const data = cursor2String(cursor, "post-authorId-createdAt-").split("||");
  return {
    createdAt: new Date(Number.parseInt(data[1], 10)),
    authorId: data[0]
  };
};

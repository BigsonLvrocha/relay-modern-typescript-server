import { idToGraphqlId } from "./graphqlId";
import { Post } from "../models/Post.model";

export const Post2IPost = (post: Post): Partial<GQL.IPost> => ({
  _id: post._id,
  id: idToGraphqlId(post._id, "post"),
  title: post.title,
  description: post.description,
  authorId: post.authorId
});

export const Post2Edge = (post: Post) => ({
  node: Post2IPost(post),
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

export const base64 = (str: string): string =>
  Buffer.from(str, "ascii").toString("base64");
export const unbase64 = (b64: string): string =>
  Buffer.from(b64, "base64").toString("ascii");

export const string2Cursor = (name: string, prefix: string) =>
  prefix + base64(name);

export const cursor2String = (cursor: string, prefix: string) =>
  unbase64(cursor.substring(prefix.length));

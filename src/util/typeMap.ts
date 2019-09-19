import { User } from "../models/User.model";
import { idToGraphqlId } from "./graphqlId";
import { Post } from "../models/Post.model";

export const UserToIUser = (user: User): GQL.IUser => ({
  active: user.active,
  name: user.name,
  email: user.email,
  _id: user._id,
  id: idToGraphqlId(user._id, "user")
});

export const UserToEdge = (user: User): GQL.IUserEdge => ({
  node: UserToIUser(user),
  cursor: string2Cursor(user.name, "user-name-")
});

export const Post2IPost = (post: Post): Partial<GQL.IPost> => ({
  _id: post._id,
  id: idToGraphqlId(post._id, "post"),
  title: post.title,
  description: post.description,
  authorId: post.authorId
});

export const base64 = (str: string): string =>
  Buffer.from(str, "ascii").toString("base64");
export const unbase64 = (b64: string): string =>
  Buffer.from(b64, "base64").toString("ascii");

export const string2Cursor = (name: string, prefix: string) =>
  prefix + base64(name);

export const cursor2String = (cursor: string, prefix: string) =>
  unbase64(cursor.substring(prefix.length));

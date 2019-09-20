import { UserNode2ModelResolver } from "../../user/types/typeMap";
import { PostNode2ModelResolver } from "../../post/types/typeMap";
import { Node2ModelResolver } from "../../../types/graphql-utils";
import { Post } from "../../../models/Post.model";
import { User } from "../../../models/User.model";

export type AvailableModel = Post & User;

export type AvailableNode2ModelResolver =
  | Node2ModelResolver<Post, GQL.IPost>
  | Node2ModelResolver<User, GQL.IUser>;

export const AvailableNode2ModelResolvers: AvailableNode2ModelResolver[] = [
  UserNode2ModelResolver,
  PostNode2ModelResolver
];

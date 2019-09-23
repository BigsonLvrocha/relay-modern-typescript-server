import { UserNode2ModelResolver } from "../../user/types/typeMap";
import { PostNode2ModelResolver } from "../../post/types/typeMap";
import { Node2ModelResolver } from "../../../types/graphql-utils";
import { Post } from "../../../models/Post.model";
import { User } from "../../../models/User.model";
import { Comment } from "../../../models/Comment.model";
import { CommentNode2ModelResolver } from "../../comment/types/typeMap";

export type AvailableModel = Post & User & Comment;

export type AvailableNode2ModelResolver =
  | Node2ModelResolver<Post, GQL.IPost>
  | Node2ModelResolver<User, GQL.IUser>
  | Node2ModelResolver<Comment, GQL.IComment>;

export const AvailableNode2ModelResolvers: AvailableNode2ModelResolver[] = [
  UserNode2ModelResolver,
  PostNode2ModelResolver,
  CommentNode2ModelResolver
];

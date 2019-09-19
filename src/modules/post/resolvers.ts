import { ResolverMap } from "../../types/graphql-utils";
import { post } from "./post";
import { PostUser } from "./user";
import { UserCreatePost } from "./userCreatePost";

export const resolvers: ResolverMap = {
  Mutation: {
    UserCreatePost
  },
  Query: {
    post
  },
  Post: {
    author: PostUser
  }
};

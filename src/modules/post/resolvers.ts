import { ResolverMap } from "../../types/graphql-utils";
import { post } from "./post";
import { PostUser } from "./user";
import { UserCreatePost } from "./userCreatePost";
import { feed } from "./feed";

export const resolvers: ResolverMap = {
  Mutation: {
    UserCreatePost
  },
  Query: {
    post,
    feed
  },
  Post: {
    author: PostUser
  }
};

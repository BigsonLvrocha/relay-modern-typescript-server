import { ResolverMap } from "../../types/graphql-utils";
import { post } from "./resolvers/post";
import { PostUser } from "./resolvers/user";
import { UserCreatePost } from "./resolvers/userCreatePost";
import { feed } from "./resolvers/feed";

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

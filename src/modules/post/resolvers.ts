import { ResolverMap } from "../../types/graphql-utils";
import { post } from "./resolvers/post";
import { PostUser } from "./resolvers/user";
import { UserCreatePost } from "./resolvers/userCreatePost";
import { EditPost } from "./resolvers/editPost";
import { feed } from "./resolvers/feed";

export const resolvers: ResolverMap = {
  Mutation: {
    UserCreatePost,
    EditPost
  },
  Query: {
    post,
    feed
  },
  Post: {
    author: PostUser
  }
};

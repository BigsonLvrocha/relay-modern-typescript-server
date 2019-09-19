import { ResolverMap } from "../../types/graphql-utils";
import { post } from "./post";
import { PostUser } from "./user";

export const resolvers: ResolverMap = {
  Query: {
    post
  },
  Post: {
    author: PostUser
  }
};

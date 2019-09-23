import { createComment as CreateComment } from "./resolvers/createComment";
import { author } from "./resolvers/commentAuthor";
import { post } from "./resolvers/commentPost";

export const resolvers = {
  Mutation: {
    CreateComment
  },
  Comment: {
    post,
    author
  }
};

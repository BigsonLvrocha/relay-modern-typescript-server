import { createComment as CreateComment } from "./resolvers/createComment";
import { author } from "./resolvers/commentAuthor";
import { post } from "./resolvers/commentPost";
import { comments } from "./resolvers/comments";

export const resolvers = {
  Mutation: {
    CreateComment
  },
  Comment: {
    post,
    author
  },
  Post: {
    comments
  }
};

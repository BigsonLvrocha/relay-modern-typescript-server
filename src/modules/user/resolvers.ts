import { default as UserChangePassword } from "./changePassword";
import { default as UserLoginWithEmail } from "./login";
import { default as UserRegisterWithEmail } from "./register";
import {
  userResolver as user,
  usersResolver as users,
  meResolver as me
} from "./queries";
import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
  Mutation: {
    UserChangePassword,
    UserLoginWithEmail,
    UserRegisterWithEmail
  },
  Query: {
    user,
    users,
    me
  }
};

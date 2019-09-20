import { default as UserChangePassword } from "./changePassword";
import { default as UserLoginWithEmail } from "./login";
import { default as UserRegisterWithEmail } from "./register";
import { userResolver as user, meResolver as me } from "./queries";
import { usersResolver as users } from "./users";
import { ResolverMap } from "../../types/graphql-utils";
import { userAddedResolver } from "./userAdded";

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
  },
  Subscription: {
    UserAdded: {
      subscribe: userAddedResolver
    }
  }
};

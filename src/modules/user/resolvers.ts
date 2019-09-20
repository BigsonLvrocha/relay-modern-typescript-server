import { default as UserChangePassword } from "./resolvers/changePassword";
import { default as UserLoginWithEmail } from "./resolvers/login";
import { default as UserRegisterWithEmail } from "./resolvers/register";
import { userResolver as user, meResolver as me } from "./resolvers/queries";
import { usersResolver as users } from "./resolvers/users";
import { ResolverMap } from "../../types/graphql-utils";
import { userAddedResolver } from "./resolvers/userAdded";

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

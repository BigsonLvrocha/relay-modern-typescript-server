import { User } from "../models/User.model";
import { idToGraphqlId } from "./graphqlId";

export const UserToIUser = (user: User): GQL.IUser => ({
  __typename: "User",
  active: user.active,
  name: user.name,
  email: user.email,
  _id: user._id,
  id: idToGraphqlId(user._id, "user")
});

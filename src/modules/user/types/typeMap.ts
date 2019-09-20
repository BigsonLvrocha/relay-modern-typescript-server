import { User } from "../../../models/User.model";
import { idToGraphqlId } from "../../../util/graphqlId";
import { string2Cursor, cursor2String } from "../../../util/typeMap";
import { Node2ModelResolver } from "../../../types/graphql-utils";

export const idPrefix = "user";
export const cursorPrefix = "user-name-";
export const ModelName = "User";

export const user2IUser = (user: User): GQL.IUser => ({
  active: user.active,
  name: user.name,
  email: user.email,
  _id: user._id,
  id: idToGraphqlId(user._id, idPrefix)
});

export const user2Edge = (user: User): GQL.IUserEdge => ({
  node: user2IUser(user),
  cursor: string2Cursor(user.name, cursorPrefix)
});

export const user2Cursor = (user: User) =>
  string2Cursor(user.name, cursorPrefix);

export const cursor2UserName = (cursor: string) =>
  cursor2String(cursor, cursorPrefix);

export const UserNode2ModelResolver: Node2ModelResolver<User, GQL.IUser> = {
  idPrefix,
  cursorPrefix,
  model2Interface: user2IUser
};

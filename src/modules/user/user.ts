import { Resolver } from "../../types/graphql-utils";

export const userResolver: Resolver = async (
  _,
  {  }: GQL.IUserOnQueryArguments
): Promise<GQL.IUser | null> => null;

export const meResolver: Resolver = async (): Promise<GQL.IUser | null> => null;

export const usersResolver: Resolver = async (
  _,
  {  }: GQL.IUsersOnQueryArguments
): Promise<GQL.IUserConnection | null> => null;

import { Request } from "express";
import { Sequelize } from "sequelize-typescript";

export interface Context {
  sequelize: Sequelize;
  request: Request;
  userId: string | undefined;
}

export type Resolver = (
  parent: any,
  agrs: any,
  context: Context,
  info: any
) => any;

export type GraphqlMiddleware = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: Context,
  info: any,
  params: any | undefined
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}

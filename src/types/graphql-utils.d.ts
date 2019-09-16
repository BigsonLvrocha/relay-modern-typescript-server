import { Request } from "express";
import { Sequelize } from "sequelize-typescript";

export interface Context {
  sequelize: Sequelize;
}

export type Resolver = (
  parent: any,
  agrs: any,
  context: Context,
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}

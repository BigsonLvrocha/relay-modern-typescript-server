import { Request } from "express";
import { Sequelize } from "sequelize-typescript";
import { PubSub } from "graphql-yoga";
import { Model } from "sequelize";

export interface Context {
  sequelize: Sequelize;
  request: Request;
  userId: string | undefined;
  pubsub: PubSub;
}

export type Resolver = (
  parent: any,
  agrs: any,
  context: Context,
  info: any
) => any;

export interface SubscriptionResolver {
  subscribe: (parent: any, agrs: any, context: Context, info: any) => any;
}

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
    [key: string]: Resolver | SubscriptionResolver;
  };
}

export type model2Node<T extends Model, U extends GQL.INode> = (
  model: T
) => Partial<U>;

export interface Node2ModelResolver<T extends Model, U extends GQL.INode> {
  idPrefix: string;
  cursorPrefix: string;
  model2Interface: model2Node<T, U>;
}

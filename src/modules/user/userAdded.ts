import { Resolver } from "../../types/graphql-utils";
import { userAddedChannelName } from "../../util/constants";

export const userAddedResolver: Resolver = (_, __, { pubsub }) => {
  const asyncIterator = pubsub.asyncIterator(userAddedChannelName);
  return asyncIterator;
};

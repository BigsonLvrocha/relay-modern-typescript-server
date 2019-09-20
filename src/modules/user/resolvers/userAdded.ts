import { Resolver } from "../../../types/graphql-utils";
import { userAddedChannelName } from "../../../util/constants";

export const userAddedResolver: Resolver = (_, __, { pubsub }) => {
  return pubsub.asyncIterator(userAddedChannelName);
};

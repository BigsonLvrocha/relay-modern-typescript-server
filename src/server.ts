import { GraphQLServer } from "graphql-yoga";
import { genSchema } from "./modules";
import { sequelize } from "./services/sequelize";
import { verifyJwt } from "./middleware/jwt";

export const startServer = () => {
  const schema = genSchema();
  const server = new GraphQLServer({
    schema,
    context: {
      sequelize
    }
  });
  server.express.use(verifyJwt);
  return server;
};

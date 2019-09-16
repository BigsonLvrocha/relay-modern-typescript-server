import { GraphQLServer } from "graphql-yoga";
import { genSchema } from "./modules";
import { sequelize } from "./services/sequelize";

class Server extends GraphQLServer {
  constructor() {
    const schema = genSchema();
    super({
      schema,
      context: {
        sequelize
      }
    });
  }
}

export default new Server();

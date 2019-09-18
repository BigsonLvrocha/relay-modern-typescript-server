import { GraphQLServer } from "graphql-yoga";
import { genSchema } from "./modules";
import { sequelize } from "./services/sequelize";
import { pubsub } from "./services/pubsub";
class Server extends GraphQLServer {
  constructor() {
    const schema = genSchema();
    super({
      schema,
      context: ({ request }) => ({
        sequelize,
        request,
        pubsub
      })
    });
    this.middleware();
    this.routes();
  }

  middleware() {
    // middlewares
  }

  routes() {
    // routes
  }
}

export default new Server();

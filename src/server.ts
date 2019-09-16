import { GraphQLServer } from "graphql-yoga";
import { genSchema } from "./modules";
import { sequelize } from "./services/sequelize";
class Server extends GraphQLServer {
  constructor() {
    const schema = genSchema();
    super({
      schema,
      context: ({ request }) => ({
        sequelize,
        request
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

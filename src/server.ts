import { GraphQLServer } from "graphql-yoga";
import { genSchema } from "./modules";
import { sequelize } from "./services/sequelize";
import { verifyJwt } from "./middleware/jwt";

class Server extends GraphQLServer {
  constructor() {
    const schema = genSchema();
    super({
      schema,
      context: {
        sequelize
      }
    });
    this.middleware();
    this.routes();
  }

  middleware() {
    this.express.use(verifyJwt);
  }

  routes() {
    //
  }
}

export default new Server();

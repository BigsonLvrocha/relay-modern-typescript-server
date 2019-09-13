export default {
  development: {
    username: "postgres",
    password: null,
    database: "relay_modern",
    host: "0.0.0.0",
    dialect: "postgres"
  },
  test: {
    username: "postgres",
    password: null,
    database: "relay_modern_test",
    host: "0.0.0.0",
    dialect: "postgres"
  },
  production: {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    host: process.env.DB_HOSTNAME as string,
    port: process.env.DB_PORT as string,
    dialect: process.env.DB_DIALECT
  }
} as any;

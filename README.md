# relay-modern-typescript-server

A graphql server written for [sibelius' relay modern course](https://relay-modern-course.now.sh/packages/)

This graphql server supports:

- registration
- authentication
- password change

## How to use this server

This project uses any SQL database supported by sequelize to run, the easiest way do it is with [docker-compose](https://docs.docker.com/compose/install/) by running bellow commands

```bash
git clone https://github.com/BigsonLvrocha/relay-modern-typescript-server.git
cd relay-modern-typescript-server
docker-compose up
```

after the process is finished, just [open the browser on localhos:5555](http://localhost:5555) and you'll see yoga's graphql client

If you would like to, you can setup with your own configuration by setting up your own .env file

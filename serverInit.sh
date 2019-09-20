npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:create --env test
npx sequelize db:migrate --env test
ts-node --files src/index.ts

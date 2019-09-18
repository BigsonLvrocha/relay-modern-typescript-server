FROM node:alpine
WORKDIR /srv/app
COPY . .
RUN yarn install
RUN npm install -g ts-node
ENV NODE_ENV development
CMD [ "npx", "ts-node", "--files", "src/index.ts" ]

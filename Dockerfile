FROM node:16-alpine

COPY app /app/src
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn --prod

ENTRYPOINT [ "node", "/app/src/app.js" ]

FROM node:16-alpine

COPY app /app
COPY package.json /package.json
COPY yarn.lock /yarn.lock

WORKDIR /

RUN yarn --prod

ENTRYPOINT [ "node", "/app/index.js" ]

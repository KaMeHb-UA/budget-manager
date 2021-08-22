FROM node:16-alpine

COPY app /app
COPY package.json /package.json
COPY yarn.lock /yarn.lock

WORKDIR /

RUN apk add --no-cache git && \
    yarn --prod && \
    apk del --no-cache git

ENTRYPOINT [ "node", "/app/index.js" ]

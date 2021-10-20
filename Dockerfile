FROM node:lts as build

WORKDIR /home/node/app

COPY . .

RUN yarn install --non-interactive --pure-lockfile
RUN yarn build

FROM node:lts-alpine

RUN apk add --update curl
WORKDIR /home/node/app

COPY *.json *.lock ./
COPY config/ ./config/
COPY --from=build /home/node/app/dist .
RUN yarn install --production

USER node
EXPOSE 3000

CMD ["node", "."]

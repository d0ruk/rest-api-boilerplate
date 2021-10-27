FROM node:16 as build

WORKDIR /home/node/app

COPY . .

RUN yarn install --non-interactive --pure-lockfile
RUN yarn build

FROM node:16-alpine

RUN apk add --update curl
WORKDIR /home/node/app

COPY *.json *.lock *.sh .sequelizerc ./
COPY config/ ./config/
COPY --from=build /home/node/app/dist .
COPY --from=build /home/node/app/migrations ./migrations

RUN yarn install --production

USER node
EXPOSE 3000

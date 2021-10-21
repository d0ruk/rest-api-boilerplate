#!/bin/sh

npx sequelize-cli db:create
npx sequelize-cli db:migrate

if [ $NODE_ENV = "development" ]; then
    npx sequelize-cli db:seed:all
    yarn inspect
    elif [ $NODE_ENV = "production" ]; then
    node .
else
    echo Invalid NODE_ENV: $NODE_ENV
fi

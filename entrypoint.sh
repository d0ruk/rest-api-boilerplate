#!/bin/sh

npx wait-on tcp:db:3306 && echo "DB ready"

[ $NODE_ENV = "development" ] && npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate

if [ $NODE_ENV = "development" ]; then
    npx sequelize-cli db:seed:undo:all
    npx sequelize-cli db:seed:all
    yarn app:dev
    elif [ $NODE_ENV = "production" ]; then
    node .
else
    echo Invalid NODE_ENV: $NODE_ENV
fi

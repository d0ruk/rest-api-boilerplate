#!/bin/sh

prepareDB () {
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
}

seedDB () {
    npx sequelize-cli db:seed:undo:all
    npx sequelize-cli db:seed:all
}

npx wait-on tcp:db:3306 && echo "DB ready"

case $NODE_ENV in
    production)
        prepareDB
        node .
    ;;
    development)
        npx sequelize-cli db:drop
        prepareDB
        seedDB
        
        yarn app:dev
    ;;
    test)
        npx sequelize-cli db:drop
        prepareDB
        seedDB
        
        if [ -z $CI ]; then
            yarn test --watchAll
        else
            yarn test --coverage
        fi
    ;;
    *)
        echo Invalid NODE_ENV: $NODE_ENV
        exit 42
        
    ;;
esac

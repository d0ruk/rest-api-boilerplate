# REST API boilerplate

A Typescript/Express.js REST API with MySQL and Redis.

You can develop in a Docker container or locally.

### Prepare

- `yarn`
- edit appropriate `$NODE_ENV.yml` files in `config/`

### **Local**

Make sure you have an instance of MySQL and Redis running on `localhost`

- **yarn app:start** - build app & run in production mode
- **yarn app:dev** - watch app in development mode

### **Docker**

- **yarn start** - compose production containers & start app
- **yarn dev** - compose development containers & watch `/src`

---

Adminer is @ http://localhost:8888

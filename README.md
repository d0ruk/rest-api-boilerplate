# REST API boilerplate

A Typescript/Express REST API with MySQL.

You can develop in a Docker container or locally.

### **Local**

```sh
yarn
```

Make sure you have an instance of MySQL running on `localhost`, and edit the a `$NODE_ENV.yml` files in `config/`.

- **yarn app:start** - build app & run in production mode
- **yarn app:dev** - watch app in development mode

### **Docker**

- **yarn start** - compose production containers & start app
- **yarn dev** - compose development containers & watch `/src`

---

Adminer is @ http://localhost:8888

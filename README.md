# REST API boilerplate

You can develop in a Docker container or locally.

### **Local**

```sh
yarn
```

Make sure you have an instance of MariaDB running on `localhost`, and edit the `local.yml` file.

- **yarn app:start** - build app & run in production mode
- **yarn app:dev** - watch app in development mode

### **Docker**

- **yarn start** - compose production containers & start app
- **yarn dev** - compose development containers & watch `/src`

---

Adminer is @ http://localhost:8888

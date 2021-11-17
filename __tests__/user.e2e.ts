import { METHODS } from "node:http";
import _request, { Response } from "supertest";
import { pick, omit } from "lodash";
import faker from "faker";
import config from "config";

//@ts-ignore
import app from "app";

let userId: number;
let userToken: string;
let adminToken: string;
const userData = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: "12345",
};

const request = (url: string, method = "get") => {
  if (!METHODS.includes(method.toUpperCase())) {
    throw new Error(`Invalid HTTP method ${method}`);
  }

  //@ts-ignore
  return _request(app)
    [method.toLowerCase()](`/v1${url}`)
    .set("Accept", "application/json")
    .expect("Content-Type", /json/);
};

beforeAll(async () => {
  const { password, email } = config.get("app.admin");

  await request("/auth", "post")
    .send({ password, email })
    .then((res: Response) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toEqual(expect.any(String));

      adminToken = res.body.token;
    });
});

describe("GET /user", () => {
  it("lists users", async () => {
    await request("/user").then((res: Response) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.rows).toEqual(expect.any(Array));
    });
  });
});

describe("POST /user", () => {
  it("creates new user", async () => {
    await request("/user", "post")
      .send(userData)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body.id).toEqual(expect.any(Number));

        userId = res.body.id;
      });
  });

  it("does not allow duplicate email", async () => {
    await request("/user", "post")
      .send(userData)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(422);

        // console.log({ body: res.body });
      });
  });

  it("does not allow malformed email", async () => {
    const data = Object.assign({}, omit(userData, ["email"]), { email: "asd" });

    await request("/user", "post")
      .send(data)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(422);
      });
  });
});

describe("POST /auth", () => {
  it("logs user in", async () => {
    await request("/auth", "post")
      .send(pick(userData, ["email", "password"]))
      .then((res: Response) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toEqual(expect.any(String));

        userToken = res.body.token;
      });
  });
});

describe("GET /user/:id", () => {
  it("needs Authorization", async () => {
    await request(`/user/${userId}`).then((res: Response) => {
      expect(res.statusCode).toEqual(401);
    });
  });

  it("user can list self", async () => {
    await request(`/user/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(200);
      });
  });

  it("user cannot list others", async () => {
    await request(`/user/2`)
      .set("Authorization", `Bearer ${userToken}`)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(403);
      });
  });

  it("admin can list others", async () => {
    await request(`/user/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(200);
      });
  });
});

describe("POST /user/:id", () => {
  it("needs Authorization", async () => {
    await request(`/user/${userId}`, "post")
      .send({})
      .then((res: Response) => {
        expect(res.statusCode).toEqual(401);
      });
  });

  it("user can update self", async () => {
    await request(`/user/${userId}`, "post")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Another Test User" })
      .then((res: Response) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.updatedAt).toEqual(expect.any(String));
      });
  });

  it("user cannot update others", async () => {
    await request(`/user/2`, "post")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Another Test User" })
      .then((res: Response) => {
        expect(res.statusCode).toEqual(403);
      });
  });

  it("admin can update others", async () => {
    await request(`/user/${userId}`, "post")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "A Test User" })
      .then((res: Response) => {
        expect(res.statusCode).toEqual(200);
      });
  });
});

describe("DELETE /user/:id", () => {
  let user2Id: number;

  beforeAll(async () => {
    const data = Object.assign({}, omit(userData, ["email"]), {
      email: faker.internet.email(),
    });

    await request("/user", "post")
      .send(data)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body.id).toEqual(expect.any(Number));

        user2Id = res.body.id;
      });
  });

  it("needs Authorization", async () => {
    await request(`/user/${userId}`, "delete").then((res: Response) => {
      expect(res.statusCode).toEqual(401);
    });
  });

  it("user cannot delete others", async () => {
    await request(`/user/${user2Id}`, "delete")
      .set("Authorization", `Bearer ${userToken}`)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(403);
      });
  });

  it("user can delete self", async () => {
    await request(`/user/${userId}`, "delete")
      .set("Authorization", `Bearer ${userToken}`)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(200);
      });
  });

  it("admin can delete others", async () => {
    await request(`/user/${user2Id}`, "delete")
      .set("Authorization", `Bearer ${adminToken}`)
      .then((res: Response) => {
        expect(res.statusCode).toEqual(200);
      });
  });
});

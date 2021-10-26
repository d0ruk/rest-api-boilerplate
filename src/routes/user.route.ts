import { Router } from "express";

import { makeController } from "util/";
import { UserCreateDto } from "dtos/";
import { validate, auth } from "middleware/";
import service from "services/user.service";

const router: Router = Router();

router.use(
  auth({
    skip: [{ url: "/", method: "POST" }],
  })
);
router.get("/", makeController(service.findAll));
router.post("/", validate(UserCreateDto), makeController(service.create));

export default router;

import { Router } from "express";

import { makeController } from "util/";
import { UserCreateDto, PaginationQueryDto } from "dtos/";
import { validate, auth } from "middleware/";
import service from "services/user.service";

const router: Router = Router();

router.use(
  auth({
    skip: [{ url: "/", method: "POST" }],
  })
);
router.get(
  "/",
  validate(PaginationQueryDto, true),
  makeController(service.findAll)
);
router.post(
  "/",
  validate(UserCreateDto),

  makeController(service.create)
);

export default router;

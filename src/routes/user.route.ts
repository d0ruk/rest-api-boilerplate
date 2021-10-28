import { Router } from "express";

import { makeController } from "util/";
import { UserCreateDto, PaginationQueryDto, FindOneParamDto } from "dtos/";
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
  validate(PaginationQueryDto, { isQuery: true }),
  makeController(service.findAll)
);
router.post("/", validate(UserCreateDto), makeController(service.create));
router.get(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  makeController(service.findOne)
);

export default router;

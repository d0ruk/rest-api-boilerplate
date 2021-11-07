import { Router } from "express";

import { makeController } from "util/";
import {
  UserCreateDto,
  UserUpdateDto,
  PaginationQueryDto,
  FindOneParamDto,
} from "dtos/";
import { validate, auth } from "middleware/";
import service from "services/user.service";

const router: Router = Router();

router.use(
  auth({
    skip: [
      { url: "/", method: "POST" },
      { url: "/", method: "GET" },
    ],
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
router.post(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  validate(UserUpdateDto),
  makeController(service.update)
);
router.delete(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  makeController(service.delete)
);

export default router;

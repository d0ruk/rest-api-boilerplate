import { Router } from "express";

import { makeController } from "util/";
import {
  TagCreateDto,
  TagUpdateDto,
  PaginationQueryDto,
  FindOneParamDto,
} from "dtos/";
import { validate, auth } from "middleware/";
import service from "services/tag.service";

const router: Router = Router();

router.use(auth());
router.get(
  "/",
  validate(PaginationQueryDto, { isQuery: true }),
  makeController(service.findAll)
);
router.post("/", validate(TagCreateDto), makeController(service.create));
router.get(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  makeController(service.findOne)
);
router.post(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  validate(TagUpdateDto),
  makeController(service.update)
);
router.delete(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  makeController(service.delete)
);

export default router;

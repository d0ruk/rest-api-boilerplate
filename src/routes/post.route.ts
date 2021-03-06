import { Router } from "express";

import { makeController } from "util/";
import {
  PostCreateDto,
  PostUpdateDto,
  PostTagsDto,
  PaginationQueryDto,
  FindOneParamDto,
} from "dtos/";
import { validate, auth } from "middleware/";
import service from "services/post.service";

const router: Router = Router();

router.use(auth());
router.get(
  "/",
  validate(PaginationQueryDto, { isQuery: true }),
  makeController(service.findAll)
);
router.post("/", validate(PostCreateDto), makeController(service.create));
router.get(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  makeController(service.findOne)
);
router.post(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  validate(PostUpdateDto),
  makeController(service.update)
);
router.delete(
  "/:id",
  validate(FindOneParamDto, { isParam: true }),
  makeController(service.delete)
);
router.post(
  "/:id/tag",
  validate(FindOneParamDto, { isParam: true }),
  validate(PostTagsDto),
  makeController(service.addTags)
);
router.post(
  "/:id/untag",
  validate(FindOneParamDto, { isParam: true }),
  validate(PostTagsDto),
  makeController(service.removeTags)
);

export default router;

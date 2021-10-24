import { Router } from "express";

import { makeController, validate } from "util/";
import { UserCreateDto } from "dtos/";
import service from "services/user.service";

const router: Router = Router();

router.get("/", makeController(service.findAll));
router.post("/", validate(UserCreateDto), makeController(service.create));

export default router;

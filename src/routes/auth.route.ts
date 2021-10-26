import { Router } from "express";

import { makeController } from "util/";
import { AuthLoginDto } from "dtos/";
import { validate } from "middleware/";
import service from "services/auth.service";

const router: Router = Router();

router.post("/", validate(AuthLoginDto), makeController(service.login));

export default router;

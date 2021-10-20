import { Router } from "express";

import { makeController } from "util/";
import service from "services/user.service";

const router: Router = Router();

router.get("/", makeController(service.findAll));

export default router;

import { Router } from "express";

import { makeController } from "util/";
import service from "services/index.service";

const router: Router = Router();

router.get("/", makeController(service.root));
router.get("/asd", makeController(service.teapot));

export default router;

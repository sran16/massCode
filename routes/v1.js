import express from "express";

import AuthRouter from "./v1/auth.js";
import ContentRouter from "./v1/content.js";

const router = express.Router();
router.use("/auth", AuthRouter);
router.use("/content", ContentRouter);
export default router;

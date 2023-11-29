import express from "express";

import AuthRouter from "./v1/auth.js";

const router = express.Router();
router.use("/auth", AuthRouter);
export default router;

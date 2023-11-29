import express from "express";

import AuthRouter from "./v1/auth.js";
import DemoRouter from "./v1/demo.js";

const router = express.Router();
router.use("/auth", AuthRouter);
router.use("/demo", DemoRouter);
export default router;

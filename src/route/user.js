import express from "express";

import { SIGN_IN, LOGIN } from "../controller/user.js";

const router = express.Router();

router.post("/signin", SIGN_IN);
router.post("/login", LOGIN);

export default router;
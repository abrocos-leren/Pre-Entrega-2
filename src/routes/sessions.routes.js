import { Router } from "express";
import Sessioncontroller from "../controllers/session.controller.js";

const router = Router()

router.post('/register', Sessioncontroller.newRegiteredUser)

router.post('/login', Sessioncontroller.logInUser)

router.get('/logout', Sessioncontroller.logOffUser)

export default router
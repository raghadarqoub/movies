import { Router } from "express";
import * as adminController from "./admin.controller.js";
import { validation } from "../../middleware/validation.js";
import * as schema from './admin.validation.js'
const router = Router();

router.post('/singUp',validation(schema.addAdmin),adminController.addAdmin);
router.post('/login',validation(schema.login),adminController.login);
router.get('/getAllAdmins',adminController.getAllAdmins);


export default router;
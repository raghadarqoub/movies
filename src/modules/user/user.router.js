import { Router } from "express";
import * as userController from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import * as schema from './user.validation.js'

const router = Router();
router.get('/getUsers',userController.getUsers);
router.post('/singUp',validation(schema.singUp),userController.singUp);
router.post('/login',validation(schema.login),userController.login);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);
router.get('/booking/:id',userController.getBookingOfUser);



export default router;
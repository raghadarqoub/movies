import { Router } from "express";
import * as bookingController from "./booking.controller.js";
const router = Router();

router.post('/addBooking',bookingController.addBooking);
router.get('/:id',bookingController.getBookingById);
router.delete('/:id',bookingController.removeBooking);

export default router;
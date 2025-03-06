import express from 'express';
import { createBooking, getBookings, getUserBookings, updateBookingStatus } from '../controllers/bookingController';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/user/:userId', getUserBookings);
router.put('/:id/status', updateBookingStatus);

export default router;

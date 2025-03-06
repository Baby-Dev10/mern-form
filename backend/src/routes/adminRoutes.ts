import express from 'express';
import { createNotification, getNotifications, markNotificationAsRead } from '../controllers/adminController';

const router = express.Router();

router.post('/', createNotification);
router.get('/notifications', getNotifications);
router.put('/notifications/:id', markNotificationAsRead);

export default router;

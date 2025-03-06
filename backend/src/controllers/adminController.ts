import { Request, Response } from 'express';
import AdminNotification from '../models/AdminNotification';

// Create a new notification for admin
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { type, plan, userName } = req.body;
    
    let message = '';
    if (type === 'premium_plan') {
      message = `${userName} has subscribed to the ${plan} premium plan.`;
    } else {
      message = `New notification from ${userName}.`;
    }
    
    const notification = new AdminNotification({
      type,
      message,
      details: req.body,
    });
    
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error creating admin notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Get all admin notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await AdminNotification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const notification = await AdminNotification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

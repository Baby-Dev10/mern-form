import { Request, Response } from 'express';
import Booking from '../models/Booking';

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error });
  }
};

// Get all bookings (admin only)
export const getBookings = async (req: Request, res: Response) => {
  try {
    // In production, add authentication and authorization checks here
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    // Map to match frontend interface structure
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      name: booking.name || '',
      age: booking.age || 0,
      sessions: booking.sessions || 0,
      paymentMethod: booking.paymentMethod || 'card',
      totalAmount: booking.totalAmount || 0,
      premiumPlan: booking.premiumPlan || null,
      email: booking.email || '',
      userId: booking.userId || '',
      status: booking.status || 'pending',
      createdAt: booking.createdAt ? booking.createdAt.toISOString() : new Date().toISOString()
    }));
    
    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error });
  }
};

// Get bookings for a specific user
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Failed to fetch user bookings', error });
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status', error });
  }
};

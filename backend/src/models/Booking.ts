import mongoose, { Document, Schema } from 'mongoose';

export interface BookingDocument extends Document {
  userId: string;
  name: string;
  age: number;
  email: string;
  sessions: number;
  paymentMethod: 'card' | 'bank';
  totalAmount: number;
  premiumPlan?: 'gold' | 'platinum' | null;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  sessions: {
    type: Number,
    required: true,
    min: 1
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank'],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  premiumPlan: {
    type: String,
    enum: ['gold', 'platinum', null],
    default: null
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed'
  }
}, { timestamps: true });

export default mongoose.model<BookingDocument>('Booking', bookingSchema);

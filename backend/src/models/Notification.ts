
import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  type: string;
  plan?: string;
  userName: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  type: { type: String, required: true },
  plan: { type: String },
  userName: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);

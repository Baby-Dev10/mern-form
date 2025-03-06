import mongoose, { Document, Schema } from 'mongoose';

export interface AdminNotificationDocument extends Document {
  type: string;
  message: string;
  details: any;
  isRead: boolean;
  createdAt: Date;
}

const adminNotificationSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model<AdminNotificationDocument>('AdminNotification', adminNotificationSchema);

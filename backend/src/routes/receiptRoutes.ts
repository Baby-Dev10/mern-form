import express, { Response } from "express";
import mongoose from "mongoose"; // added
import { generateReceiptPDF } from "../utils/pdfGenerator";
import Booking from "../models/Booking";
import User from "../models/User";

const router = express.Router();

// GET /api/receipts/:bookingId
// Download receipt for a specific booking
router.get("/:bookingId", async (req, res: Response) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Get user info if available and valid ObjectId
    let email;
    if (booking.userId && mongoose.Types.ObjectId.isValid(booking.userId)) {
      const user = await User.findById(booking.userId);
      email = user?.email;
    }

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt-${bookingId}.pdf`
    );

    // Generate PDF and pipe it directly to the response
    const receiptData = {
      id: booking._id,
      name: booking.name,
      email: booking.email,
      sessions: booking.sessions,
      premiumPlan: booking.premiumPlan ?? null, // fixed: ensure not undefined
      paymentMethod: booking.paymentMethod,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt,
    };

    const doc = generateReceiptPDF(receiptData, res);
    doc.pipe(res); // pipe now here
    doc.end();
  } catch (error) {
    console.error("Error generating receipt:", error);
    res.status(500).json({ message: "Error generating receipt", error });
  }
});

export default router;

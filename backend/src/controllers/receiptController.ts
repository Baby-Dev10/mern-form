import { Request, Response } from "express";
import Booking from "../models/Booking";
import { generateReceiptPDF } from "../utils/pdfGenerator";

export const generateReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt-${id}.pdf`
    );

    // Create receipt data with proper types
    const receiptData = {
      id: booking._id.toString(),
      name: booking.name,
      email: booking.email || "", // Ensure email is always a string
      sessions: booking.sessions,
      premiumPlan: booking.premiumPlan ?? null, // Ensure it's string | null
      paymentMethod: booking.paymentMethod,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt,
    };

    generateReceiptPDF(receiptData, res); // Pass res correctly
  } catch (error) {
    console.error("Error generating receipt:", error);

    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Error generating receipt", error });
    }
  }
};

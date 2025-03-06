import PDFDocument from "pdfkit";
import { Response } from "express";

interface ReceiptData {
  id: string;
  name: string;
  email: string;
  sessions: number;
  premiumPlan: string | null;
  paymentMethod: string;
  totalAmount: number;
  createdAt: Date | string;
}

export const generateReceiptPDF = (data: ReceiptData, res: Response) => {
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(res);

  // PDF styling
  const titleColor = "#2563eb"; // Blue
  const accentColor = "#4f46e5"; // Indigo
  const textColor = "#374151"; // Gray-700

  // Add company logo/header
  doc
    .fontSize(20)
    .fillColor(titleColor)
    .text("SessionFlow", { align: "center" })
    .fontSize(12)
    .fillColor(accentColor)
    .text("Booking Receipt", { align: "center" });

  // Add a horizontal line
  doc.moveTo(50, 120).lineTo(550, 120).strokeColor(accentColor).stroke();

  // Receipt information
  doc.moveDown(2);

  // Format date
  const dateStr =
    typeof data.createdAt === "string"
      ? new Date(data.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : data.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  // Booking details
  doc.fillColor(textColor);

  // Left column (labels)
  const leftX = 100;
  let yPosition = 150;

  doc
    .fontSize(10)
    .text("Receipt No:", leftX, yPosition)
    .text("Date:", leftX, yPosition + 20)
    .text("Customer:", leftX, yPosition + 40)
    .text("Email:", leftX, yPosition + 60)
    .text("Sessions Booked:", leftX, yPosition + 80)
    .text("Plan Type:", leftX, yPosition + 100)
    .text("Payment Method:", leftX, yPosition + 120)
    .text("Amount Paid:", leftX, yPosition + 140);

  // Right column (values)
  const rightX = 200;

  doc
    .fontSize(10)
    .text(`#${data.id.toString().substring(0, 8)}`, rightX, yPosition) // converted data.id to string
    .text(dateStr, rightX, yPosition + 20)
    .text(data.name, rightX, yPosition + 40)
    .text(data.email || "N/A", rightX, yPosition + 60)
    .text(data.sessions.toString(), rightX, yPosition + 80)
    .text(
      data.premiumPlan
        ? data.premiumPlan.charAt(0).toUpperCase() + data.premiumPlan.slice(1)
        : "Standard",
      rightX,
      yPosition + 100
    )
    .text(
      data.paymentMethod.charAt(0).toUpperCase() + data.paymentMethod.slice(1),
      rightX,
      yPosition + 120
    )
    .text(
      `₹${data.totalAmount.toLocaleString("en-IN")}`,
      rightX,
      yPosition + 140
    );

  // Add a summary box
  yPosition = 350;

  doc
    .roundedRect(100, yPosition, 400, 80, 5)
    .fillAndStroke("#f3f4f6", accentColor);

  doc.fillColor(textColor).text("Payment Summary", 250, yPosition + 10);

  doc.text("Total Amount:", 150, yPosition + 40);
  doc.text(`₹${data.totalAmount.toLocaleString("en-IN")}`, 350, yPosition + 40);

  // Footer
  doc
    .fontSize(10)
    .text("Thank you for choosing SessionFlow!", { align: "center" }) // removed extra argument
    .fontSize(8)
    .text(
      "This is a computer-generated receipt and does not require a signature.",
      { align: "center" }
    );

  return doc;
};

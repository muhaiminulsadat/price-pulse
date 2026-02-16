"use server";
import nodemailer from "nodemailer";

// Validate environment variables early
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error(
    "EMAIL_USER and EMAIL_PASS must be set in environment variables",
  );
}

// Create reusable transporter (only once)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return {success: true, messageId: info.messageId};
  } catch (error) {
    console.error("Email error:", error);
    return {success: false, error: error.message};
  }
}

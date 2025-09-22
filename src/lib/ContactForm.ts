"use server";

import { sendEmailToAdmin } from "./sendEmail";

export async function handleContactForm(
  name: string,
  email: string,
  message: string
) {
  const subject = `New Contact Form Submission from ${name}`;
  const html = `
    <h2>Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  return await sendEmailToAdmin(email, subject, html);
}

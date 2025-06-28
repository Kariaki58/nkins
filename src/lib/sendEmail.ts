"use server";
import nodemailer from "nodemailer";

// Type for email configuration
interface EmailConfig {
    service: string;
    secure: boolean;
    port: number;
    auth: {
        user: string | undefined;
        pass: string | undefined;
    };
}

// Type for mail options
interface MailOptions {
    from: string | undefined;
    to: string | string[];
    subject: string;
    html: string;
}

/**
 * Sends an email to a recipient
 * @param email Recipient email address
 * @param subject Email subject
 * @param html Email content in HTML format
 * @returns Promise<boolean> indicating success
 */
export async function sendEmail(email: string, subject: string, html: string): Promise<boolean> {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.APP_PASSWORD,
            },
        } as EmailConfig);

        const mailOptions: MailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

/**
 * Sends an email to admin from a user
 * @param email Sender email address
 * @param subject Email subject
 * @param html Email content in HTML format
 * @returns Promise<boolean> indicating success
 */
export async function sendEmailToAdmin(email: string, subject: string, html: string): Promise<boolean> {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.APP_PASSWORD,
            },
        } as EmailConfig);

        const mailOptions: MailOptions = {
            from: email,
            to: process.env.EMAIL_ADDRESS,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email to admin:', error);
        return false;
    }
}

/**
 * Sends an inquiry email to admin
 * @param subject Email subject
 * @param html Email content in HTML format
 * @returns Promise<boolean> indicating success
 */
export async function sendInquire(subject: string, html: string): Promise<boolean> {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.APP_PASSWORD,
            },
        } as EmailConfig);

        const mailOptions: MailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: process.env.EMAIL_ADDRESS,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending inquiry:', error);
        return false;
    }
}
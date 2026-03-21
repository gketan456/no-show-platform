import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (toEmail, subject, message) => {
    const msg = {
        to: toEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: subject,
        html: message
    };
    try {
        await sgMail.send(msg);
        console.log("Email sent successfully to:", toEmail);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};
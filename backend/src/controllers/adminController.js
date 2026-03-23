import { getAllAppointmentsWithPredictionsService } from "../services/adminService.js";
import { sendEmail } from "../services/emailService.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
};

export const getAllAppointmentsWithPredictions = async (req, res, next) => {
    try {
        const appointments = await getAllAppointmentsWithPredictionsService();
        handleResponse(res, 200, "appointments retrieved successfully", appointments);
    } catch (err) {
        next(err);
    }
};

export const sendReminderEmail = async (req, res, next) => {
    try {
        const { patientEmail, patientName, appointmentDay, no_show_probability } = req.body;

        if (!patientEmail) {
            return handleResponse(res, 400, "patientEmail is required");
        }

        let subject = "";
        let emailBody = "";

        if (no_show_probability >= 0.7) {
            subject = "Important — Appointment Reminder";
            emailBody = `
                <h2>Hi ${patientName},</h2>
                <p>You have an upcoming appointment on <strong>${appointmentDay}</strong>.</p>
                <p>Our team will contact you shortly to confirm.</p>
            `;
        } else if (no_show_probability >= 0.5) {
            subject = "Appointment Reminder — Please Confirm";
            emailBody = `
                <h2>Hi ${patientName},</h2>
                <p>Your appointment is on <strong>${appointmentDay}</strong>.</p>
                <p>Please confirm you are coming.</p>
            `;
        } else {
            subject = "Appointment Confirmation";
            emailBody = `
                <h2>Hi ${patientName},</h2>
                <p>Your appointment is confirmed for <strong>${appointmentDay}</strong>.</p>
                <p>We look forward to seeing you.</p>
            `;
        }

        await sendEmail(patientEmail, subject, emailBody);
        handleResponse(res, 200, "reminder email sent successfully");

    } catch (err) {
        next(err);
    }
};

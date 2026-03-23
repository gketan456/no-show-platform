import axios from "axios";
import { savePredictionService, getPredictionByAppointmentIdService } from "../services/predictionService.js";
import { sendSMS } from "../services/notificationService.js";
import { sendEmail } from "../services/emailService.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
};

export const createPrediction = async (req, res, next) => {
    try {
        const {
            appointment_id,
            Gender,
            Age,
            Neighbourhood,
            ScheduledDay,
            AppointmentDay,
            Scholarship,
            Hipertension,
            Diabetes,
            Alcoholism,
            Handcap,
            patientName,
            patientPhone,
            patientEmail
        } = req.body;

        if (!appointment_id) {
            return handleResponse(res, 400, "appointment_id is required");
        }

        const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
            Gender,
            Age,
            Neighbourhood,
            ScheduledDay,
            AppointmentDay,
            Scholarship,
            Hipertension,
            Diabetes,
            Alcoholism,
            Handcap
        });

        const {
            no_show_probability,
            risk_flag,
            recommended_action,
            model_version
        } = mlResponse.data;

        const prediction = await savePredictionService(
            appointment_id,
            model_version,
            no_show_probability,
            risk_flag,
            0.7,
            recommended_action
        );

    

        // SMS block
        if (patientPhone) {
            let smsMessage = "";

            if (no_show_probability >= 0.7) {
                smsMessage = `Hi ${patientName}, you have a HIGH risk appointment on ${AppointmentDay}. Our team will contact you to confirm.`;
            } else if (no_show_probability >= 0.5) {
                smsMessage = `Hi ${patientName}, your appointment is on ${AppointmentDay}. Please confirm you are coming.`;
            } else {
                smsMessage = `Hi ${patientName}, reminder: your appointment is on ${AppointmentDay}. See you then.`;
            }


            try {
                await sendSMS(patientPhone, smsMessage);
                console.log("SMS sent successfully");
            } catch (smsError) {
                console.error("SMS ERROR:", smsError.message);
            }
        }

        // Email block
        if (patientEmail) {
            let subject = "";
            let emailBody = "";

            if (no_show_probability >= 0.7) {
                subject = "Important — Appointment Reminder";
                emailBody = `
                    <p>Hi ${patientName},</p>
                    <p>You have an appointment on <strong>${AppointmentDay}</strong>.</p>
                    <p>Our team will contact you shortly.</p>
                `;
            } else if (no_show_probability >= 0.5) {
                subject = "Appointment Reminder — Please Confirm";
                emailBody = `
                    <p>Hi ${patientName},</p>
                    <p>Your appointment is on <strong>${AppointmentDay}</strong>.</p>
                    <p>Please confirm you are coming.</p>
                `;
            } else {
                subject = "Appointment Confirmation";
                emailBody = `
                    <p>Hi ${patientName},</p>
                    <p>Your appointment is confirmed for <strong>${AppointmentDay}</strong>.</p>
                    <p>See you then.</p>
                `;
            }

            try {
                await sendEmail(patientEmail, subject, emailBody);
                console.log("Email sent successfully");
            } catch (emailError) {
                console.error("EMAIL ERROR:", emailError.message);
            }
        }

        // respond after everything is done
        handleResponse(res, 201, "prediction created successfully", prediction);

    } catch (error) {
        next(error);
    }
};

export const getPredictionByAppointmentId = async (req, res, next) => {
    try {
        const { appointment_id } = req.params;
        const prediction = await getPredictionByAppointmentIdService(appointment_id);
        if (!prediction) {
            return handleResponse(res, 404, "prediction not found");
        }
        handleResponse(res, 200, "prediction retrieved successfully", prediction);
    } catch (error) {
        next(error);
    }
};
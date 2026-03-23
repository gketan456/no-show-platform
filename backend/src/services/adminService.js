import pool from "../config/db.js";

export const getAllAppointmentsWithPredictionsService = async () => {
    const result = await pool.query(`
        SELECT 
            a.id as appointment_id,
            a.scheduled_day,
            a.appointment_day,
            a.status,
            p.id as patient_id,
            p.full_name,
            p.email,
            p.phone,
            p.age,
            p.gender,
            p.neighbourhood,
            p.hypertension,
            p.diabetes,
            p.scholarship,
            p.alcoholism,
            p.handicap,
            pred.no_show_probability,
            pred.risk_flag,
            pred.recommended_action,
            pred.created_at as prediction_date
        FROM appointments a
        JOIN patients p ON p.id = a.patient_id
        LEFT JOIN predictions pred ON pred.appointment_id = a.id
        ORDER BY a.appointment_day ASC
    `);
    return result.rows;
};
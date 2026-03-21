import pool from "../config/db.js";

export const createAppointmentService = async (
    patient_id,
    scheduled_day,
    appointment_day,
    status
) => {
    const appointment = await pool.query(
        `INSERT INTO appointments (patient_id, scheduled_day, appointment_day, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [patient_id, scheduled_day, appointment_day, status || "scheduled"]
    );
    return appointment.rows[0];
};

export const getAllAppointmentsService = async () => {
    const appointments = await pool.query(`SELECT * FROM appointments`);
    return appointments.rows;
};

export const getAppointmentByIdService = async (id) => {
    const appointment = await pool.query(
        `SELECT * FROM appointments WHERE id = $1`,
        [id]
    );
    return appointment.rows[0];
};

export const updateAppointmentService = async (
    id,
    patient_id,
    scheduled_day,
    appointment_day,
    status
) => {
    const appointment = await pool.query(
        `UPDATE appointments
     SET patient_id = $1,
         scheduled_day = $2,
         appointment_day = $3,
         status = $4
     WHERE id = $5
     RETURNING *`,
        [patient_id, scheduled_day, appointment_day, status, id]
    );
    return appointment.rows[0];
};

export const deleteAppointmentsService = async (id) => {
    const appointment = await pool.query(
        `DELETE FROM appointments WHERE id = $1 RETURNING *`,
        [id]
    );
    return appointment.rows[0];
};
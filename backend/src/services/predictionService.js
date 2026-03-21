import pool from "../config/db.js";

export const savePredictionService = async (appointment_id, model_version, no_show_probability, risk_flag, threshold, recommended_action)=>{
    const prediction = await pool.query(`insert into predictions (appointment_id,model_version,no_show_probability,risk_flag,threshold,recommended_action) values ($1,$2,$3,$4,$5,$6) returning * `,[appointment_id,model_version,no_show_probability,risk_flag,threshold,recommended_action]);
    return prediction.rows[0];

}

export const getPredictionByAppointmentIdService = async(appointment_id)=>{
    const prediction = await pool.query(`select * from predictions where appointment_id = $1 ORDER BY created_at DESC 
     LIMIT 1`, [appointment_id]);
    return prediction.rows[0];
}


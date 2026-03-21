import pool from "../config/db.js";

export const createPatientService = async (full_name,email,phone)=>{
    const result = await pool.query(`INSERT INTO patients (full_name,email,phone) VALUES ($1,$2,$3) RETURNING * `,[full_name,email,phone]);
    return result.rows[0];

}

export const getAllPatientsService = async()=>{
    const result = await pool.query("select * from patients order by id asc");
    return result.rows;
}

export const getPatientByIdService = async(id)=>{
    const result = await pool.query("select * from patients where id = $1",[id]);
    return result.rows[0];

}

export const updatePatientService = async(id,full_name,email,phone)=>{
    const result = await pool.query(`UPDATE patients SET full_name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`, [full_name, email, phone, id]);
    return result.rows[0];
}

export const deletePatientService = async(id)=>{
    const result = await pool.query("delete from patients where id =$1 returning *",[id]);
    return result.rows[0];
}

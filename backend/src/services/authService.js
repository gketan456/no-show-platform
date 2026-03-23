import pool from '../config/db.js';

export const createUserService = async(name, email, password_hash, role) => {
    const result = await pool.query(`
        insert into users (name,email,password_hash,role) values($1,$2,$3,$4) returning id,name,email,role,created_at
    `, [name, email, password_hash, role]);
    return result.rows[0];
}

export const getUserByEmailService = async(email) => {
    const result = await pool.query(`
        select * from users where email = $1
    `, [email]);
    return result.rows[0];
}
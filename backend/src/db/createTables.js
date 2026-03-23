import pool from "../config/db.js";

const createTables = async () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const patientsTable = `
  CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    age INTEGER,
    gender VARCHAR(1),
    neighbourhood VARCHAR(100),
    hypertension BOOLEAN DEFAULT FALSE,
    diabetes BOOLEAN DEFAULT FALSE,
    scholarship BOOLEAN DEFAULT FALSE,
    alcoholism BOOLEAN DEFAULT FALSE,
    handicap INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

  const appointmentsTable = `
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL REFERENCES patients(id),
      scheduled_day TIMESTAMP NOT NULL,
      appointment_day TIMESTAMP NOT NULL,
      status varchar(20) default 'scheduled',
      created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    const predictionsTable = `
  CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    model_version VARCHAR(50),
    no_show_probability FLOAT,
    risk_flag BOOLEAN,
    threshold FLOAT,
    recommended_action VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

  try {
    await pool.query(usersTable);
    await pool.query(patientsTable);
    await pool.query(appointmentsTable);
    await pool.query(predictionsTable);
    console.log("users, patients, and appointments  predictions tables are ready");
  } catch (error) {
    console.error("error creating tables:", error.message);
  }
};

export default createTables;
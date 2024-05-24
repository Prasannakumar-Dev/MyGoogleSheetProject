// postgres.js
const { Pool } = require("pg");
const { postgres } = require("../config/config");

const pool = new Pool(postgres);

async function createEmployeeTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        employee_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        position VARCHAR(50),
        department VARCHAR(50),
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(15) UNIQUE
      );
    `);
    console.log("Employee table created successfully");
  } catch (e) {
    console.error("Error creating employee table:", e);
  } finally {
    client.release();
  }
}

async function insertEmployee(data) {
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO employees (first_name, last_name, position, department, email, phone_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING employee_id;
    `;
    const res = await client.query(insertQuery, data);
    console.log("New employee ID:", res.rows[0].employee_id);
  } catch (e) {
    console.error("Error inserting employee:", e);
  } finally {
    client.release();
  }
}

async function closePool() {
  await pool.end();
}

module.exports = { createEmployeeTable, insertEmployee, closePool };

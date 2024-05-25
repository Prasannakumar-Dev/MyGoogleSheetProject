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
    console.log('Employee table created successfully');
  } catch (e) {
    console.error('Error creating employee table:', e);
  } finally {
    client.release();
  }
}

async function insertEmployees(batch) {
  const client = await pool.connect();
  try {
    for (const data of batch) {
      const [first_name, last_name, position, department, email, phone_number] = data;

      const duplicateExists = await client.query(
        `SELECT employee_id FROM employees WHERE email = $1 OR phone_number = $2`,
        [email, phone_number]
      );

      if (duplicateExists.rows.length > 0) {
        console.log(`Employee with email ${email} or phone number ${phone_number} already exists. Skipping.`);
      } else {
        const insertQuery = `
          INSERT INTO employees (first_name, last_name, position, department, email, phone_number)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING employee_id;
        `;
        const res = await client.query(insertQuery, [first_name, last_name, position, department, email, phone_number]);
        console.log("New employee ID:", res.rows[0].employee_id);
      }
    }
  } catch (e) {
    console.error("Error inserting employees:", e);
  } finally {
    client.release();
  }
}

async function closePool() {
  await pool.end();
}

module.exports = { createEmployeeTable, insertEmployees, closePool };

// models/leadModel.js — data access layer for the `leads` table.
// All queries use parameterized statements ($1, $2, ...) to prevent SQL injection.
const pool = require('../config/db');

const LeadModel = {
  /**
   * Insert a new lead. Returns the created row.
   * Throws a Postgres error with code '23505' on duplicate email.
   */
  async create({ fullName, email, company, ipAddress, userAgent }) {
    const query = `
      INSERT INTO leads (full_name, email, company, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, company, created_at
    `;
    const values = [fullName, email.toLowerCase(), company || null, ipAddress || null, userAgent || null];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT id FROM leads WHERE LOWER(email) = LOWER($1) LIMIT 1';
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
  },

  async findAll({ limit = 500, offset = 0 } = {}) {
    const query = `
      SELECT id, full_name, email, company, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
  },

  async count() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM leads');
    return rows[0].count;
  },

  async deleteById(id) {
    const query = 'DELETE FROM leads WHERE id = $1 RETURNING id';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },
};

module.exports = LeadModel;

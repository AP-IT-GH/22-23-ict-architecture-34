const pg = require('pg');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(dotenv.config());
const connectionString = process.env.DATABASE_URL;
console.log('connection string', connectionString);
const pool = new pg.Pool({ connectionString: connectionString });

async function createUpload(mimetype, size, filename, email) {
  const result = await pool.query(
    'INSERT INTO uploads (mimetype, size, filename, email) VALUES ($1, $2, $3, $4) RETURNING id', [mimetype, size, filename, email]);
  return result.rows[0];
}

async function getUploads() {
  const result = await pool.query('SELECT * FROM uploads');
  return result.rows;
}

async function getUpload(id) {
  const result = await pool.query('SELECT * FROM uploads WHERE id = $1', [id]);
  return result.rows[0];
}

async function deleteUpload(id) {
  await pool.query('DELETE FROM uploads WHERE id = $1', [id]);
}

async function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS uploads (
      id SERIAL PRIMARY KEY,
      mimetype VARCHAR(255),
      size INTEGER,
      filename VARCHAR(255),
      email VARCHAR(255)
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Table created if not exists');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

module.exports = {
  createUpload,
  getUploads,
  getUpload,
  deleteUpload,
};

console.log('creating table if not exists...');
createTable()
  .then(() => console.log('table created if not exists'))
  .catch((err) => {
    console.log(err);
    console.log('database not available, exiting');
    process.exit(1);
  });

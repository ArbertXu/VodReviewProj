
const { Pool } = require('pg');
const { connectionString } = require('pg/lib/defaults.js');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const poolComment = new Pool({
    connectionString: process.env.COMMENT_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})


module.exports = pool, poolComment;

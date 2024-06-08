const express = require('express');

const { Pool } = require('pg');

const cors = require('cors');
 
const app = express();

const port = 4000;
 
// Configure PostgreSQL client

const pool = new Pool({

  user: 'bit',

  host: 'db',  // Ensure this matches the service name in Docker Compose

  database: 'bitcoin_explorer',

  password: 'bit',

  port: 5432,

});
 
app.use(cors());
 
app.get('/api/block-height', async (req, res) => {

  try {

    console.log('Received request for block height');

    const result = await pool.query('SELECT id, block_height, timestamp FROM blocks ORDER BY id DESC LIMIT 1');

    if (result.rows.length > 0) {

      console.log('Data fetched successfully:', result.rows[0]);

      res.json(result.rows[0]);

    } else {

      console.log('No data found');

      res.status(404).json({ error: 'No data found' });

    }


   
  } catch (err) {

    console.error('Database query error:', err);

    res.status(500).json({ error: 'Internal server error', details: err.message });

  }

});
 
app.listen(port, () => {

  console.log(`Server is running on http://localhost:${port}`);

});

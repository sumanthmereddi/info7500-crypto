const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 4000;

// Configure PostgreSQL client
const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'bitcoin_explorer',
  password: 'bit',
  port: 5432,
});

app.use(cors());

app.get('/api/block-height', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, block_height, timestamp FROM blocks ORDER BY id DESC LIMIT 1');
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/last-blocks', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, block_height, timestamp FROM blocks ORDER BY id DESC LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/off-chain-metrics', async (req, res) => {
  try {
    const [coinPaprikaTickerResponse, coinPaprikaOHLCVResponse] = await Promise.all([
      axios.get('https://api.coinpaprika.com/v1/tickers/btc-bitcoin'),
      axios.get('https://api.coinpaprika.com/v1/coins/btc-bitcoin/ohlcv/today')
    ]);

    const price = coinPaprikaTickerResponse.data.quotes.USD.price;
    const marketCap = coinPaprikaTickerResponse.data.quotes.USD.market_cap;
    const percentChange = coinPaprikaTickerResponse.data.quotes.USD.percent_change_24h;
    const high = coinPaprikaOHLCVResponse.data[0].high;
    const low = coinPaprikaOHLCVResponse.data[0].low;
    const open = coinPaprikaOHLCVResponse.data[0].open;
    const close = coinPaprikaOHLCVResponse.data[0].close;
    const socialMediaMentions = 1200; // Static value for demo purposes

    res.json({ price, marketCap, percentChange, open, high, low, close, socialMediaMentions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

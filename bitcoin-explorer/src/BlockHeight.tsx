import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './BlockHeight.css'; // Import custom CSS

interface BlockData {
  id: number;
  block_height: number;
  timestamp: string;
}

interface OffChainMetrics {
  price: number;
  marketCap: number;
  socialMediaMentions: number;
  percentChange: number;
  high: number;
  low: number;
}

const BlockHeight: React.FC = () => {
  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [lastBlocks, setLastBlocks] = useState<BlockData[]>([]);
  const [offChainMetrics, setOffChainMetrics] = useState<OffChainMetrics | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [marketCapHistory, setMarketCapHistory] = useState<number[]>([]);
  const [timestampHistory, setTimestampHistory] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/block-height');
        setBlockData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchLastBlocks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/last-blocks');
        setLastBlocks(response.data);
        const timestamps = response.data.map((block: BlockData) => new Date(block.timestamp).toLocaleString());
        setTimestampHistory(timestamps);
      } catch (error) {
        console.error('Error fetching last blocks:', error);
      }
    };

    const fetchOffChainMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/off-chain-metrics');
        setOffChainMetrics(response.data);
        setPriceHistory((prev) => [...prev, response.data.price]);
        setMarketCapHistory((prev) => [...prev, response.data.marketCap]);
      } catch (error) {
        console.error('Error fetching off-chain metrics:', error);
      }
    };

    fetchData();
    fetchLastBlocks();
    fetchOffChainMetrics();

    const interval = setInterval(() => {
      fetchData();
      fetchLastBlocks();
      fetchOffChainMetrics();
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const priceData = {
    labels: timestampHistory,
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceHistory,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        tension: 0.1,
      },
    ],
  };

  const marketCapData = {
    labels: timestampHistory,
    datasets: [
      {
        label: 'Bitcoin Market Cap (USD)',
        data: marketCapHistory,
        fill: false,
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        pointBorderColor: 'rgba(153,102,255,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(153,102,255,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        tension: 0.1,
      },
    ],
  };

  const blockHeightDistribution = {
    labels: lastBlocks.map((block) => `ID: ${block.id}`),
    datasets: [
      {
        label: 'Block Height Distribution',
        data: lastBlocks.map((block) => block.block_height),
        backgroundColor: 'rgba(255,159,64,0.6)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container">
      <h1 className="title">Current Block Data</h1>
      {blockData ? (
        <div className="block-data">
          <p>Block ID: {blockData.id}</p>
          <p>Block Height: {blockData.block_height}</p>
          <p>Timestamp: {new Date(blockData.timestamp).toLocaleString()}</p>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}

      <h2 className="subtitle">Last 5 Blocks</h2>
      {lastBlocks.length > 0 ? (
        <table className="blocks-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Block Height</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {lastBlocks.map((block) => (
              <tr key={block.id}>
                <td>{block.id}</td>
                <td>{block.block_height}</td>
                <td>{new Date(block.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="loading">Loading...</p>
      )}

      <h2 className="subtitle">Off-Chain Metrics</h2>
      {offChainMetrics ? (
        <div className="off-chain-metrics">
          <p>Bitcoin Price: ${offChainMetrics.price?.toFixed(2)}</p>
          <p>Bitcoin Market Cap: ${offChainMetrics.marketCap?.toFixed(2)}</p>
          <p>Percentage Change: {offChainMetrics.percentChange?.toFixed(2)}%</p>
          <p>24h High: ${offChainMetrics.high?.toFixed(2)}</p>
          <p>24h Low: ${offChainMetrics.low?.toFixed(2)}</p>
          <p>Social Media Mentions: {offChainMetrics.socialMediaMentions}</p>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}

      <h2 className="subtitle">Bitcoin Price History</h2>
      <div className="chart-container">
        <Line data={priceData} options={{ responsive: true, maintainAspectRatio: false, animation: { duration: 2000, easing: 'easeInOutBounce' } }} />
      </div>

      <h2 className="subtitle">Bitcoin Market Cap History</h2>
      <div className="chart-container">
        <Line data={marketCapData} options={{ responsive: true, maintainAspectRatio: false, animation: { duration: 2000, easing: 'easeInOutBounce' } }} />
      </div>

      <h2 className="subtitle">Block Height Distribution</h2>
      <div className="chart-container">
        <Bar data={blockHeightDistribution} options={{ responsive: true, maintainAspectRatio: false, animation: { duration: 2000, easing: 'easeInOutBounce' } }} />
      </div>
    </div>
  );
};

export default BlockHeight;

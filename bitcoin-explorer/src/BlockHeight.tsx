import React, { useEffect, useState } from 'react';

import axios from 'axios';

import './BlockHeight.css';  // Import the CSS file
 
interface BlockData {


  
  id: number;

  block_height: number;

  timestamp: string;

}
 
const BlockHeight: React.FC = () => {

  const [blockData, setBlockData] = useState<BlockData | null>(null);
 
  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await axios.get('http://localhost:4000/api/block-height');

        setBlockData(response.data);

      } catch (error) {

        console.error('Error fetching block data:', error);

      }

    };
 
    fetchData();

  }, []);
 
  if (!blockData) {

    return <div>Loading...</div>;

  }
 
  return (

    <div className="block-height-container">

      <div className="scrolling-headline">

        <div>INFO 7500 - Bitcoin Explorer Project : BTC value as of today $70432 </div>

      </div>

      <div className="table-container">

        <h1>Latest Block Data</h1>

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>Block Height</th>

              <th>Timestamp</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>{blockData.id}</td>

              <td>{blockData.block_height}</td>

              <td>{new Date(blockData.timestamp).toLocaleString()}</td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );

};
 
export default BlockHeight;

// src/HardwareCheckout.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HardwareCheckout.css';

const HardwareCheckout = ({ projectId, userId }) => {
  const [hardwareData, setHardwareData] = useState({
    hwSet1: { capacity: 10, available: 10, request: '' },
    hwSet2: { capacity: 15, available: 15, request: '' },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/hardware_status`, { params: { projectId } });
        setHardwareData(response.data);
      } catch (error) {
        console.error("Error fetching hardware data:", error);
      }
    };
    fetchData();
  }, [projectId]);

  const handleChange = (e, hwSet) => {
    const { name, value } = e.target;
    setHardwareData(prevData => ({
      ...prevData,
      [hwSet]: { ...prevData[hwSet], [name]: value }
    }));
  };

  const handleCheckOut = async (hwSet) => {
    const requestedQuantity = parseInt(hardwareData[hwSet].request);
    if (requestedQuantity > hardwareData[hwSet].available) {
      alert(`Requested quantity exceeds available stock for ${hwSet}`);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/check_out`, {
        projectId,
        hwName: hwSet,
        quantity: requestedQuantity
      });
      alert(response.data.message);
      setHardwareData(prevData => ({
        ...prevData,
        [hwSet]: { 
          ...prevData[hwSet], 
          available: prevData[hwSet].available - requestedQuantity, 
          request: '' 
        }
      }));
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed.");
    }
  };

  const handleCheckIn = async (hwSet) => {
    const requestedQuantity = parseInt(hardwareData[hwSet].request);

    try {
      const response = await axios.post(`http://localhost:5000/check_in`, {
        projectId,
        hwName: hwSet,
        quantity: requestedQuantity
      });
      alert(response.data.message);
      setHardwareData(prevData => ({
        ...prevData,
        [hwSet]: { 
          ...prevData[hwSet], 
          available: prevData[hwSet].available + requestedQuantity, 
          request: '' 
        }
      }));
    } catch (error) {
      console.error("Error during check-in:", error);
      alert("Check-in failed.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Hardware Checkout</h2>
      <table className="checkout-table">
        <thead>
          <tr>
            <th>Hardware Set</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Request</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {['hwSet1', 'hwSet2'].map(hwSet => (
            <tr key={hwSet}>
              <td>{hwSet === 'hwSet1' ? 'Hardware Set 1' : 'Hardware Set 2'}</td>
              <td>{hardwareData[hwSet].capacity}</td>
              <td>{hardwareData[hwSet].available}</td>
              <td>
                <input
                  type="number"
                  name="request"
                  value={hardwareData[hwSet].request}
                  onChange={(e) => handleChange(e, hwSet)}
                  className="input-request"
                />
              </td>
              <td className="actions-cell">
                <button onClick={() => handleCheckOut(hwSet)} className="button-checkout">Check Out</button>
                <button onClick={() => handleCheckIn(hwSet)} className="button-checkin">Check In</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HardwareCheckout;

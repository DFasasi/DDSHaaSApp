import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './HardwareCheckout.css';

const HardwareCheckout = () => {
  const location = useLocation();
  const { userId, projectId } = location.state;

  const [hardwareData, setHardwareData] = useState({});

  // Extracted data fetching function
  const fetchHardwareData = async () => {
    try {
      const response = await axios.post('http://localhost:5000/get_hardware_data', {
        projectId,
        userId,
      });

      if (response.data) {// && response.data.status === 'success'
        setHardwareData(response.data.hardwareData);
      } else {
        alert(response.data.message || 'Failed to load hardware data.');
      }
    } catch (error) {
      console.error('Error fetching hardware data:', error);
      alert('Error fetching hardware data.');
    }
  };

  // Fetch hardware data when the component mounts
  useEffect(() => {
    fetchHardwareData();
  }, [projectId, userId]);

  const handleChange = (e, hwSet) => {
    const { name, value } = e.target;
    setHardwareData(prevData => ({
      ...prevData,
      [hwSet]: { ...prevData[hwSet], [name]: value }
    }));
  };

  const handleCheckOut = async (hwSet) => {
    let requestedQuantity = parseInt(hardwareData[hwSet].request);
    if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
      alert("Please enter a valid quantity to check out.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/check_out`, {
        projectId,
        hwName: hwSet,
        quantity: requestedQuantity,
        userId
      });

      if (response.data) {
        alert(response.data.message);
        // Reload hardware data after successful checkout
        await fetchHardwareData();
      } else {
        alert(response.data.message);
        await fetchHardwareData();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed.");
      await fetchHardwareData();
    }
  };

  const handleCheckIn = async (hwSet) => {
    let requestedQuantity = parseInt(hardwareData[hwSet].request);
    if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
      alert("Please enter a valid quantity to check in.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/check_in`, {
        projectId,
        hwName: hwSet,
        quantity: requestedQuantity,
        userId
      });

      if (response.data) {
        alert(response.data.message);
        // Reload hardware data after successful check-in
        await fetchHardwareData();
      } else {
        alert(response.data.message);
      }
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
            <th>Checked Out</th>
            <th>Request</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(hardwareData).length === 0 ? (
            <tr>
              <td colSpan="6">Loading hardware data...</td>
            </tr>
          ) : (
            Object.keys(hardwareData).map(hwSet => (
              <tr key={hwSet}>
                <td>{hwSet}</td>
                <td>{hardwareData[hwSet].capacity}</td>
                <td>{hardwareData[hwSet].available}</td>
                <td>{hardwareData[hwSet].checkedOut}</td>
                <td>
                  <input
                    type="number"
                    name="request"
                    value={hardwareData[hwSet].request}
                    onChange={(e) => handleChange(e, hwSet)}
                    className="input-request"
                    min="0"
                  />
                </td>
                <td className="actions-cell">
                  <button onClick={() => handleCheckOut(hwSet)} className="button-checkout">Check Out</button>
                  <button onClick={() => handleCheckIn(hwSet)} className="button-checkin">Check In</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HardwareCheckout;

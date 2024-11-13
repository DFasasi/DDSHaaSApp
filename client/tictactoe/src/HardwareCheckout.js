import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './HardwareCheckout.css';

const HardwareCheckout = () => {
  const location = useLocation();
  const { userId, projectId } = location.state;

  const initialHardwareData = {
    'Hardware Set 1': { capacity: 200, available: 200, checkedOut: 0, request: '' },
    'Hardware Set 2': { capacity: 200, available: 200, checkedOut: 0, request: '' },
  };

  const [hardwareData, setHardwareData] = useState(initialHardwareData);

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

      if (response.data.status === "success") {
        alert(response.data.message);
        const { available, checkedOut } = response.data;
        setHardwareData(prevData => ({
          ...prevData,
          [hwSet]: {
            ...prevData[hwSet],
            available,
            checkedOut,
            request: ''
          }
        }));
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed.");
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

      if (response.data.success) {
        alert(response.data.message);
        const { available, checkedOut } = response.data;
        setHardwareData(prevData => ({
          ...prevData,
          [hwSet]: {
            ...prevData[hwSet],
            available,
            checkedOut,
            request: ''
          }
        }));
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
          {Object.keys(hardwareData).map(hwSet => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HardwareCheckout;

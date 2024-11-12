import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HardwareCheckout.css';

const HardwareCheckout = ({ projectId, userId }) => {
  const [hardwareData, setHardwareData] = useState({
    hwSet1: { capacity: 200, available: 200, checkedOut: 0, request: '' },
    hwSet2: { capacity: 200, available: 200, checkedOut: 0, request: '' },
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
    let requestedQuantity = parseInt(hardwareData[hwSet].request);
    if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
      alert("Please enter a valid quantity to check out.");
      return;
    }

    let availableQuantity = hardwareData[hwSet].available;

    if (requestedQuantity > availableQuantity) {
      // Proceed with checking out all available units
      requestedQuantity = availableQuantity;
      alert(`Only ${availableQuantity} units of ${hwSet} are available. Proceeding to check out all available units.`);
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
        setHardwareData(prevData => ({
          ...prevData,
          [hwSet]: {
            ...prevData[hwSet],
            available: prevData[hwSet].available - requestedQuantity,
            checkedOut: prevData[hwSet].checkedOut + requestedQuantity,
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

    let checkedOutQuantity = hardwareData[hwSet].checkedOut;

    if (requestedQuantity > checkedOutQuantity) {
      alert(`You cannot check in more than you have checked out. You have only checked out ${checkedOutQuantity} units of ${hwSet}.`);
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
        setHardwareData(prevData => ({
          ...prevData,
          [hwSet]: {
            ...prevData[hwSet],
            available: prevData[hwSet].available + requestedQuantity,
            checkedOut: prevData[hwSet].checkedOut - requestedQuantity,
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
          {['hwSet1', 'hwSet2'].map(hwSet => (
            <tr key={hwSet}>
              <td>{hwSet === 'hwSet1' ? 'Hardware Set 1' : 'Hardware Set 2'}</td>
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

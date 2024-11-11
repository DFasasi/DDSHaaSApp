import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HardwareCheckout = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        hwSet1: { capacity: '', available: '', request: ''}, 
        hwSet2: { capacity: '', available: '', request: ''},
    });

    const handleChange = (event, hwSet) => { 
        const { name, value } = event.target; 
        setForm(prevForm => ({ 
            ...prevForm, 
            [hwSet]: { ...prevForm[hwSet], [name]: value }
        }));
    };

    const handleCheckin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/check_in', {
                hwSet1: form.hwSet1.request,
                hwSet2: form.hwSet2.request
            });
            alert(response.data.message || "Hardware was checked in successfully");
        } catch (error) {
            console.error("Error during check-in:", error);
            alert("Check-in failed.");
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await axios.post('http://localhost:5000/check_out', {
                hwSet1: form.hwSet1.request,
                hwSet2: form.hwSet2.request
            });
            alert(response.data.message || "Hardware was checked out successfully");
        } catch (error) {
            console.error("Error during check-out:", error);
            alert("Checkout failed.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Hardware Checkout</h2>
            <table style={{ borderCollapse: 'collapse', marginBottom: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '5px' }}>Capacity</th>
                        <th style={{ padding: '5px' }}>Available</th>
                        <th style={{ padding: '5px' }}>Request</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input
                                type="text"
                                value={form.hwSet1.capacity}
                                name="capacity"
                                onChange={(e) => handleChange(e, 'hwSet1')}
                                style={{ width: '60px' }}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={form.hwSet1.available}
                                name="available"
                                onChange={(e) => handleChange(e, 'hwSet1')}
                                style={{ width: '60px' }}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={form.hwSet1.request}
                                name="request"
                                onChange={(e) => handleChange(e, 'hwSet1')}
                                style={{ width: '60px' }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="text"
                                value={form.hwSet2.capacity}
                                name="capacity"
                                onChange={(e) => handleChange(e, 'hwSet2')}
                                style={{ width: '60px' }}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={form.hwSet2.available}
                                name="available"
                                onChange={(e) => handleChange(e, 'hwSet2')}
                                style={{ width: '60px' }}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={form.hwSet2.request}
                                name="request"
                                onChange={(e) => handleChange(e, 'hwSet2')}
                                style={{ width: '60px' }}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleCheckin} style={{ backgroundColor: '#cc7a29', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                    Check In
                </button>
                <button onClick={handleCheckout} style={{ backgroundColor: '#cc7a29', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                    Check Out
                </button>
            </div>
        </div>
    );
};

export default HardwareCheckout;

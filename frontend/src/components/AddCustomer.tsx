// frontend/src/components/AddCustomer.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCustomer.css'; // Create this file for styling

const AddCustomer: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [credit, setCredit] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/customers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, credit: parseFloat(credit) }),
            });

            if (!response.ok) {
                throw new Error('Failed to add customer');
            }

            const newCustomer = await response.json();
            alert('Customer added successfully!');
            navigate('/customers');
        } catch (error) {
            console.error('Error adding customer:', error);
            alert('Failed to add customer. Please try again.');
        }
    };

    return (
        <div className="add-customer-container">
            <div className="add-customer-card">
                <div className="add-customer-header">
                    <h1>Add New Customer</h1>
                    <button 
                        className="back-button" 
                        onClick={() => navigate('/customers')}
                    >
                        Back to Customers
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="add-customer-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter customer name"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter customer email"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="credit">Credit Amount</label>
                        <input
                            type="number"
                            id="credit"
                            value={credit}
                            onChange={(e) => setCredit(e.target.value)}
                            placeholder="Enter credit amount"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="submit-button">Add Customer</button>
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;
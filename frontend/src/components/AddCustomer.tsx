// frontend/src/components/AddCustomer.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCustomer.css'; // Create this file for styling

const AddCustomer: React.FC = () => {
    // Existing state variables
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [credit, setCredit] = useState('');
    const [note, setNote] = useState('');
    // New state variables
    const [showTransactionPopup, setShowTransactionPopup] = useState(false);
    const [transactionDescription, setTransactionDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Show popup to get transaction description
        setShowTransactionPopup(true);
    };

    const submitCustomerWithTransaction = async () => {
        try {
            const response = await fetch('/api/customers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    credit: parseFloat(credit), 
                    note,
                    transaction_description: transactionDescription || 'Initial credit' 
                }),
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

    // Add this transaction popup component
    const TransactionPopup = () => (
        <div className="transaction-popup-overlay">
            <div className="transaction-popup">
                <h3>Transaction Details</h3>
                <p>Please provide a description for this initial credit of ${credit}</p>
                <div className="form-group">
                    <label htmlFor="transactionDescription">Description</label>
                    <input
                        type="text"
                        id="transactionDescription"
                        value={transactionDescription}
                        onChange={(e) => setTransactionDescription(e.target.value)}
                        placeholder="e.g., Initial store credit"
                    />
                </div>
                <div className="popup-actions">
                    <button 
                        className="submit-button" 
                        onClick={submitCustomerWithTransaction}
                    >
                        Submit
                    </button>
                    <button 
                        className="cancel-button"
                        onClick={() => setShowTransactionPopup(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

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
            {showTransactionPopup && <TransactionPopup />}
        </div>
    );
};

export default AddCustomer;
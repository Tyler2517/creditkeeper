import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCustomer.css';

const AddCustomer: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [credit, setCredit] = useState('0');
    const [note, setNote] = useState('');
    const [transactionDescription, setTransactionDescription] = useState('');
    const [showTransactionPopup, setShowTransactionPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!name || !email) {
            alert('Please fill out all required fields');
            return;
        }
        
        // Only show transaction popup if credit is greater than 0
        if (parseFloat(credit) > 0) {
            setShowTransactionPopup(true);
        } else {
            // If no initial credit, just submit without transaction description
            submitCustomerWithTransaction();
        }
    };

    const submitCustomerWithTransaction = async () => {
        if (!transactionDescription.trim() && parseFloat(credit) > 0) {
            alert('Please provide a description for this initial credit');
            return;
        }

        try {
            setIsSubmitting(true);
            
            const response = await fetch('/api/customers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    credit: parseFloat(credit) || 0, 
                    note,
                    transaction_description: transactionDescription || 'Initial credit' 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add customer');
            }

            const newCustomer = await response.json();
            alert('Customer added successfully!');
            navigate('/customers');
        } catch (error: any) {
            console.error('Error adding customer:', error);
            alert(`Failed to add customer: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Transaction popup component
    const TransactionPopup = () => (
        <div className="transaction-popup-overlay">
            <div className="transaction-popup">
                <h3>Transaction Details</h3>
                <p>Please provide a description for this initial credit of ${parseFloat(credit).toFixed(2)}</p>
                <div className="form-group">
                    <label htmlFor="transactionDescription">Description</label>
                    <input
                        type="text"
                        id="transactionDescription"
                        value={transactionDescription}
                        onChange={(e) => setTransactionDescription(e.target.value)}
                        placeholder="e.g., Initial store credit"
                        autoFocus
                        required
                    />
                </div>
                <div className="popup-actions">
                    <button 
                        className="submit-button" 
                        onClick={submitCustomerWithTransaction}
                        disabled={!transactionDescription.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                    <button 
                        className="cancel-button"
                        onClick={() => setShowTransactionPopup(false)}
                        disabled={isSubmitting}
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
                <h2>Add New Customer</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name *</label>
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
                        <label htmlFor="email">Email *</label>
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
                        <label htmlFor="credit">Initial Credit ($)</label>
                        <input
                            type="number"
                            id="credit"
                            value={credit}
                            onChange={(e) => setCredit(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="note">Notes (Optional)</label>
                        <textarea
                            id="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add any additional notes about this customer"
                            rows={3}
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={!name || !email || isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Customer'}
                        </button>
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => navigate('/customers')}
                            disabled={isSubmitting}
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
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import './CustomerDetail.css';

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTransactionPopup, setShowTransactionPopup] = useState(false);
    const [transactionDescription, setTransactionDescription] = useState('');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [previousCredit, setPreviousCredit] = useState(0);
    const navigate = useNavigate();

    // Fetch customer data
    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/customers/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Customer not found');
                }
                return response.json();
            })
            .then(data => {
                setCustomer(data);
                setPreviousCredit(parseFloat(data.credit));
                setIsLoading(false);
                // Fetch transactions after customer data is loaded
                fetchTransactions(data.id);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
                setError(error.message);
                setIsLoading(false);
            });
    }, [id]);

    // Fetch transaction history
    const fetchTransactions = (customerId: number) => {
        // Use the correct base URL for your API
        const apiUrl = `/api/customers/${customerId}/transactions/`;
        
        console.log("Requesting transactions from:", apiUrl);
            
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTransactions(data);
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
                // Set empty array to avoid rendering issues
                setTransactions([]);
            });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setCustomer(prevState => ({
            ...prevState!,
            [name]: value
        }));
    };

    // Handle credit change specifically
    const handleCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Store previous credit when editing starts
        if (!isEditing) {
            setPreviousCredit(customer?.credit || 0);
        }
        setCustomer(prevState => ({
            ...prevState!,
            credit: parseFloat(value) || 0
        }));
    };

    // Update the handleSave function to check for credit changes
    // Update the handleSave function to check specifically what changed
    const handleSave = () => {
        if (!customer) return;
        
        // Check if credit has changed
        if (previousCredit !== parseFloat(String(customer.credit))) {
            // Show the transaction popup to collect description
            setShowTransactionPopup(true);
        } else {
            // If no credit change, just save normally
            saveCustomerWithoutTransaction();
        }
    };

    // Split the save function into two parts
    const saveCustomerWithoutTransaction = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/customers/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customer)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update customer');
            }
            
            const data = await response.json();
            setCustomer(data);
            // Update previousCredit to match the saved credit value
            setPreviousCredit(parseFloat(data.credit));
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating customer data:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // This function is called from the popup after description is provided
    const saveCustomer = async () => {
        if (!transactionDescription.trim()) {
            alert('Please provide a description for this credit change');
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch(`/api/customers/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...customer,
                    transaction_description: transactionDescription
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update customer');
            }
            
            const data = await response.json();
            setCustomer(data);
            // Update previousCredit to match the saved credit value
            setPreviousCredit(parseFloat(data.credit));
            setIsEditing(false);
            
            // Refresh transactions
            fetchTransactions(data.id);
            
        } catch (error: any) {
            console.error('Error updating customer data:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
            setShowTransactionPopup(false);
            setTransactionDescription('');
        }
    };

    const handleCancel = () => {
        // Revert changes
        fetch(`/api/customers/${id}/`)
            .then(response => response.json())
            .then(data => {
                setCustomer(data);
                setIsEditing(false);
            })
            .catch(error => console.error('Error fetching customer data:', error));
    };

    const handleBack = () => {
        navigate('/customers');
    };

    // Updated TransactionPopup component
    const TransactionPopup: React.FC<{
        previousCredit: number,
        newCredit: number,
        description: string,
        onDescriptionChange: (value: string) => void,
        onSave: () => void,
        onCancel: () => void
    }> = ({ previousCredit, newCredit, description, onDescriptionChange, onSave, onCancel }) => (
        <div className="transaction-popup-overlay">
        <div className="transaction-popup">
            <h3>Credit Change</h3>
            <p><strong>Credit changing from ${parseFloat(previousCredit.toString()).toFixed(2)} to ${parseFloat(newCredit.toString()).toFixed(2)}</strong></p>
            <p>Please provide a reason for this change:</p>
            <div className="form-group">
            <label htmlFor="transactionDescription">Description</label>
            <input
                type="text"
                id="transactionDescription"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="e.g., Store credit for returned item"
                required
                autoFocus
                maxLength={255} /* Add a maximum length to prevent extremely long inputs */
            />
            </div>
            <div className="popup-actions">
            <button 
                className="save-button" 
                onClick={onSave}
                disabled={!description.trim()}
            >
                Save Change
            </button>
            <button 
                className="cancel-button"
                onClick={onCancel}
            >
                Cancel
            </button>
            </div>
        </div>
        </div>
    );
    // Transaction history table
    const renderTransactionHistory = () => (
        <div className="transaction-history">
            <h3>Transaction History</h3>
            {transactions.length === 0 ? (
                <p>No transaction history available</p>
            ) : (
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Previous Credit</th>
                            <th>New Credit</th>
                            <th>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{new Date(transaction.created_at).toLocaleString()}</td>
                                <td>{transaction.description}</td>
                                <td>${transaction.previous_credit}</td>
                                <td>${transaction.new_credit}</td>
                                <td className={transaction.credit_change >= 0 ? 'positive' : 'negative'}>
                                    {transaction.credit_change >= 0 ? '+' : ''}${Math.abs(transaction.credit_change).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    if (isLoading && !customer) {
        return <div className="loading">Loading customer details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }
    const handleDescriptionChange = (value: string) => {
        setTransactionDescription(value);
      };

    const handlePopupCancel = () => {
    // Reset credit to previous value when canceled
    setCustomer(prevState => ({
        ...prevState!,
        credit: previousCredit
    }));
    setShowTransactionPopup(false);
    setTransactionDescription('');
    };

    // Example of handling note changes
    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (customer) {
            setCustomer({
                ...customer,
                note: e.target.value
            });
        }
    };

    return (
        <div className="customer-detail-container">
            <div className="customer-detail-header">
                <h1>Customer Details</h1>
                <button className="back-button" onClick={handleBack}>
                    Back to Customers
                </button>
            </div>

            {customer && (
                <div className="customer-detail-card">
                    <div className="customer-id">Customer ID: {customer.id}</div>
                    <form className="customer-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={customer.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={customer.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="credit">Store Credit ($)</label>
                            <input
                                type="number"
                                id="credit"
                                name="credit"
                                value={customer.credit}
                                onChange={handleCreditChange}
                                disabled={!isEditing}
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="note">Note</label>
                            <textarea
                                id="note"
                                name="note"
                                value={customer.note || ''}
                                onChange={handleNoteChange}
                                disabled={!isEditing}
                                rows={4}
                            />
                        </div>

                        <div className="customer-actions">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        className="save-button"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="edit-button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </form>
                    
                    {/* Transaction history section */}
                    {renderTransactionHistory()}
                </div>
            )}
            
            {/* Transaction popup */}
            {showTransactionPopup && (
            <TransactionPopup
            previousCredit={previousCredit}
            newCredit={customer?.credit || 0}
            description={transactionDescription}
            onDescriptionChange={handleDescriptionChange}
            onSave={saveCustomer}
            onCancel={handlePopupCancel}
            />
        )}
        </div>
    );
};

export default CustomerDetail;
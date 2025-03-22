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
    const navigate = useNavigate();

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
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
                setError(error.message);
                setIsLoading(false);
            });
    }, [id]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setCustomer(prevState => ({
            ...prevState!,
            [name]: value
        }));
    };

    const handleSave = () => {
        setIsLoading(true);
        fetch(`/api/customers/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update customer');
                }
                return response.json();
            })
            .then(data => {
                setCustomer(data);
                setIsEditing(false);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error updating customer data:', error);
                setError(error.message);
                setIsLoading(false);
            });
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

    if (isLoading && !customer) return (
        <div className="customer-detail-container">
            <div className="loading-spinner">Loading customer details...</div>
        </div>
    );

    if (error) return (
        <div className="customer-detail-container">
            <div className="error-message">
                <h2>Error</h2>
                <p>{error}</p>
                <button className="back-button" onClick={handleBack}>Back to Customers</button>
            </div>
        </div>
    );

    if (!customer) return (
        <div className="customer-detail-container">
            <div className="error-message">
                <h2>Customer Not Found</h2>
                <p>The requested customer could not be found.</p>
                <button className="back-button" onClick={handleBack}>Back to Customers</button>
            </div>
        </div>
    );

    return (
        <div className="customer-detail-container">
            <div className="customer-detail-header">
                <h1>Customer Details</h1>
                <button className="back-button" onClick={handleBack}>
                    Back to List
                </button>
            </div>

            <div className="customer-detail-card">
                <div className="customer-id">Customer ID: {customer.id}</div>
                
                <div className="customer-form">
                    <div className="form-group">
                        <label>Name:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={customer.name}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        ) : (
                            <div className="form-value">{customer.name}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        ) : (
                            <div className="form-value">{customer.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Credit Balance:</label>
                        {isEditing ? (
                            <input
                                type="number"
                                name="credit"
                                value={customer.credit}
                                onChange={handleInputChange}
                                className="form-input"
                                step="0.01"
                            />
                        ) : (
                            <div className="form-value credit-value">
                                ${parseFloat(customer.credit.toString()).toFixed(2)}
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="note">Notes</label>
                        {isEditing ? (
                            <textarea
                                id="note"
                                name="note"
                                value={customer.note || ''}
                                onChange={handleInputChange}
                                rows={4}
                                className="form-control"
                            />
                        ) : (
                            <p>{customer.note || 'No notes added yet.'}</p>
                        )}
                    </div>
                </div>

                <div className="action-buttons">
                    {isEditing ? (
                        <>
                            <button 
                                className="save-button" 
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button 
                                className="cancel-button" 
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button 
                            className="edit-button" 
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Customer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
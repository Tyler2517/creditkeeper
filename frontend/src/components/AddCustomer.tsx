// frontend/src/components/AddCustomer.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h1>Add New Customer</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="credit">Credit:</label>
                    <input
                        type="number"
                        id="credit"
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Customer</button>
            </form>
        </div>
    );
};

export default AddCustomer;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Customer } from '../types';

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch(`/api/customers/${id}/`)
            .then(response => response.json())
            .then(data => setCustomer(data))
            .catch(error => console.error('Error fetching customer data:', error));
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer(prevState => ({
            ...prevState!,
            [name]: value
        }));
    };

    const handleSave = () => {
        fetch(`/api/customers/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
            .then(response => response.json())
            .then(data => {
                setCustomer(data);
                setIsEditing(false);
            })
            .catch(error => console.error('Error updating customer data:', error));
    };

    if (!customer) return <div>Loading...</div>;

    return (
        <div>
            <h1>Customer Detail</h1>
            {isEditing ? (
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={customer.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={customer.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Credit:
                        <input
                            type="number"
                            name="credit"
                            value={customer.credit}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <p>Name: {customer.name}</p>
                    <p>Email: {customer.email}</p>
                    <p>Credit: {customer.credit}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
}

export default CustomerDetail;
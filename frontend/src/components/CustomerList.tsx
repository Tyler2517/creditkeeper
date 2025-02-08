// In your React app (e.g., frontend/src/components/CustomerList.tsx)
import React, { useEffect, useState } from 'react';
import { Customer } from '../types';// Adjust the import path based on where you defined your interface

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        // Adjust the URL as needed based on your backend configuration
        fetch('/api/customers/')
            .then(response => response.json())
            .then(data => setCustomers(data))
            .catch(error => console.error('Error fetching customer data:', error));
    }, []);

    return (
        <div>
            <h1>Customer List</h1>
            <ul>
                {customers.map(customer => (
                    <li key={customer.id}>{customer.name} - Credit: {customer.credit}</li>
                ))}
            </ul>
        </div>
    );
}

export default CustomerList;
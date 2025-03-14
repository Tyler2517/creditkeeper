// frontend/src/components/CustomerList.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Customer } from '../types';

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const navigate = useNavigate();

    const fetchCustomers = () => {
        fetch('/api/customers/')
            .then(response => response.json())
            .then(data => setCustomers(data))
            .catch(error => console.error('Error fetching customer data:', error));
    };

    useEffect(() => {
        fetchCustomers();

        // Add event listener for when the window regains focus
        window.addEventListener('focus', fetchCustomers);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('focus', fetchCustomers);
        };
    }, []);

    const handleCreateCustomer = () => {
        navigate('/add-customer');
    };

    return (
        <div>
            <h1>Customer List</h1>
            <button onClick={handleCreateCustomer}>Create Customer</button>
            <ul>
                {customers.map(customer => (
                    <li key={customer.id}>
                        <Link to={`/customers/${customer.id}`}>
                            {customer.name} - Email: {customer.email} - Credit: {customer.credit}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CustomerList;
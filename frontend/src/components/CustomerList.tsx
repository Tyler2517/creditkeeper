// frontend/src/components/CustomerList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Customer } from '../types';

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
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
                    <li key={customer.id}>
                        <Link to={`/customers/${customer.id}`}>
                            {customer.name} - Credit: {customer.credit}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CustomerList;
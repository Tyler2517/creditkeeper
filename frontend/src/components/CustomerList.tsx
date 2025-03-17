import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Customer } from '../types';

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    const fetchCustomers = () => {
        fetch(`/api/customers/?page=${currentPage}&page_size=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                // Check if data.customers exists, otherwise use data directly
                const customerData = data.customers || data;
                setCustomers(Array.isArray(customerData) ? customerData : []);
                // Only set these if they exist in the response
                if (data.total_pages) setTotalPages(data.total_pages);
                if (data.current_page) setCurrentPage(data.current_page);
            })
            .catch(error => console.error('Error fetching customer data:', error));
    };

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, pageSize]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleCreateCustomer = () => {
        navigate('/add-customer');
    };

    return (
        <div>
            <h1>Customer List</h1>
            <button onClick={handleCreateCustomer}>Create Customer</button>
            <div>
                <label htmlFor="pageSize">Items per page: </label>
                <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <ul>
                {customers.map(customer => (
                    <li key={customer.id}>
                        <Link to={`/customers/${customer.id}`}>
                            {customer.name} - Email: {customer.email} - Credit: {customer.credit}
                        </Link>
                    </li>
                ))}
            </ul>
            <div>
                <label htmlFor="pageSizeBottom">Items per page: </label>
                <select id="pageSizeBottom" value={pageSize} onChange={handlePageSizeChange}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default CustomerList;
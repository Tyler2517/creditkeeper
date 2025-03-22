import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import './CustomerList.css';

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchCustomers = () => {
        setIsLoading(true);
        const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
        fetch(`/api/customers/?page=${currentPage}&page_size=${pageSize}${searchParam}`)
            .then(response => response.json())
            .then(data => {
                // Check if data.customers exists, otherwise use data directly
                const customerData = data.customers || data;
                setCustomers(Array.isArray(customerData) ? customerData : []);
                // Only set these if they exist in the response
                if (data.total_pages) setTotalPages(data.total_pages);
                if (data.current_page) setCurrentPage(data.current_page);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, pageSize, searchTerm]);

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

    const filteredCustomers = searchTerm 
        ? customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
        : customers;

    return (
        <div className="customer-list-container">
            <div className="customer-list-header">
                <h1>Customer List</h1>
                <button className="create-button" onClick={handleCreateCustomer}>
                    Add New Customer
                </button>
            </div>
            
            <div className="customer-list-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="page-size-selector">
                    <label htmlFor="pageSize">Items per page: </label>
                    <select 
                        id="pageSize" 
                        value={pageSize} 
                        onChange={handlePageSizeChange}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <>
                    <div className="customer-table-container">
                        <table className="customer-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Credit</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.id}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.email}</td>
                                            <td>${parseFloat(customer.credit.toString()).toFixed(2)}</td>
                                            <td>
                                                <Link to={`/customers/${customer.id}`} className="view-button">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{textAlign: 'center'}}>
                                            No customers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button 
                            className="pagination-button"
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="page-indicator">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            className="pagination-button"
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomerList;
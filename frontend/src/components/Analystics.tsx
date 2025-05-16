import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import './Analystics.css';

const Analytics: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // Fetch customers with pagination
  useEffect(() => {
    const fetchCustomers = () => {
      setIsLoading(true);
      fetch(`/api/customers/?page=${currentPage}&page_size=${pageSize}`)
        .then(response => response.json())
        .then(data => {
          // Check if data.customers exists, otherwise use data directly (same as CustomerList)
          const customerData = data.customers || data;
          setCustomers(Array.isArray(customerData) ? customerData : []);
          
          // Set pagination data
          if (data.total_pages) setTotalPages(data.total_pages);
          if (data.current_page) setCurrentPage(data.current_page);
          
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching customer data:', error);
          setIsLoading(false);
        });
    };

    fetchCustomers();
  }, [currentPage, pageSize]);

  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  // Calculate analytics for selected customers
  const calculateTotalCredit = () => {
    return customers
      .filter(customer => selectedCustomers.includes(customer.id))
      .reduce((sum, customer) => sum + parseFloat(customer.credit.toString()), 0)
      .toFixed(2);
  };

  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
          disabled={currentPage === i}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Customer Analytics</h1>
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>

      {isLoading ? (
        <p>Loading customer data...</p>
      ) : (
        <>
          <div className="analytics-summary">
            <div className="summary-card">
              <h3>Selected Customers</h3>
              <p className="summary-value">{selectedCustomers.length}</p>
            </div>
            <div className="summary-card">
              <h3>Total Credit</h3>
              <p className="summary-value">${calculateTotalCredit()}</p>
            </div>
          </div>

          <div className="customer-selection">
            <h2>Select Customers for Analysis</h2>
            
            <div className="table-controls">
              <div className="page-size-control">
                <label htmlFor="page-size">Show:</label>
                <select
                  id="page-size"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>entries</span>
              </div>
            </div>
            
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Credit</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr 
                    key={customer.id}
                    className={selectedCustomers.includes(customer.id) ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleCustomerSelect(customer.id)}
                      />
                    </td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>${parseFloat(customer.credit.toString()).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {renderPagination()}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
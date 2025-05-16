import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import './Analystics.css';

const Analytics: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all customers for analysis - using similar approach to CustomerList
  useEffect(() => {
    const fetchCustomers = () => {
      setIsLoading(true);
      // Get all customers by setting a large page size
      fetch(`/api/customers/?page=1&page_size=100`)
        .then(response => response.json())
        .then(data => {
          // Check if data.customers exists, otherwise use data directly (same as CustomerList)
          const customerData = data.customers || data;
          setCustomers(Array.isArray(customerData) ? customerData : []);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching customer data:', error);
          setIsLoading(false);
        });
    };

    fetchCustomers();
  }, []);

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

  // Calculate analytics for selected customers
  const calculateTotalCredit = () => {
    return customers
      .filter(customer => selectedCustomers.includes(customer.id))
      .reduce((sum, customer) => sum + parseFloat(customer.credit.toString()), 0)
      .toFixed(2);
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
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
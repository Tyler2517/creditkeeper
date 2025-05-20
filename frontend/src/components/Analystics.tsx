import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import './Analystics.css';
import * as XLSX from 'xlsx';

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

const exportToExcel = async () => {
        // Filter only selected customers
        const selectedCustomerData = customers.filter(customer => 
            selectedCustomers.includes(customer.id)
        );
        
        if (selectedCustomerData.length === 0) {
            alert('Please select at least one customer to export');
            return;
        }
        
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        
        // Add the main customers sheet
        const customersWorksheet = XLSX.utils.json_to_sheet(selectedCustomerData);
        XLSX.utils.book_append_sheet(workbook, customersWorksheet, 'Customers');
        
        // Set loading state
        setIsLoading(true);
        
        try {
            // Fetch and add transaction history for each selected customer
            for (const customer of selectedCustomerData) {
            const response = await fetch(`/api/customers/${customer.id}/transactions/`);
            
            if (!response.ok) {
                console.error(`Failed to fetch transactions for customer ${customer.id}`);
                continue;
            }
            
            const transactions = await response.json();
            
            if (transactions && transactions.length > 0) {
                // Format transaction data for better readability
                const formattedTransactions = transactions.map((t: any) => ({
                Date: new Date(t.created_at).toLocaleString(),
                Description: t.description,
                'Previous Credit': `$${parseFloat(t.previous_credit).toFixed(2)}`,
                'New Credit': `$${parseFloat(t.new_credit).toFixed(2)}`,
                'Change': `$${(parseFloat(t.new_credit) - parseFloat(t.previous_credit)).toFixed(2)}`
                }));
                
                // Create a worksheet for this customer's transactions
                const transactionSheet = XLSX.utils.json_to_sheet(formattedTransactions);
                
                // Add the sheet to the workbook with a name that includes the customer's name
                const sheetName = `${customer.name.substring(0, 20)} Transactions`; // Limit name length for Excel
                XLSX.utils.book_append_sheet(workbook, transactionSheet, sheetName);
            }
            }
            
            // Generate the file and trigger download
            XLSX.writeFile(workbook, 'customer_data_with_transactions.xlsx');
            
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('An error occurred while exporting data');
        } finally {
            setIsLoading(false);
        }
    };

    // Add this function to your Analytics component
    const handleSelectAll = () => {
      if (selectedCustomers.length === customers.length) {
        // If all are selected, unselect all
        setSelectedCustomers([]);
      } else {
        // Otherwise select all
        setSelectedCustomers(customers.map(customer => customer.id));
      }
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
                <button 
                    className="export-button" 
                    onClick={exportToExcel}
                    disabled={selectedCustomers.length === 0}
                    >
                    Export Selected to Excel
                </button>
            </div>
            
            <table className="customer-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === customers.length && customers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
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
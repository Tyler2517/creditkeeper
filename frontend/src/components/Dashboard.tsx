// frontend/src/components/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaChartBar, FaCog, FaPlus } from 'react-icons/fa';
import './Dashboard.css'; // Create this file for styling

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  link: string;
  description?: string; // Add description for more context
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, link, description }) => (
  <Link to={link} className="dashboard-card">
    <div className="card-icon">{icon}</div>
    <div className="card-content">
      <h3>{title}</h3>
      {description && <p className="card-description">{description}</p>}
    </div>
  </Link>
);

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Credit Keeper</h1>
        <p className="dashboard-subtitle">Manage your customers and their credit balances</p>
      </header>
      
      <div className="dashboard-grid">
        <DashboardCard 
          icon={<FaUsers size={48} />}
          title="Customers"
          link="/customers"
          description="View and manage your customer list"
        />
        <DashboardCard 
          icon={<FaPlus size={48} />}
          title="Add Customer"
          link="/add-customer"
          description="Create a new customer record"
        />
        <DashboardCard 
          icon={<FaChartBar size={48} />}
          title="Analytics"
          link="/analytics"
          description="View customer credit statistics"
        />
        <DashboardCard 
          icon={<FaCog size={48} />}
          title="Settings"
          link="/settings"
          description="Configure application settings"
        />
      </div>
    </div>
  );
};

export default Dashboard;
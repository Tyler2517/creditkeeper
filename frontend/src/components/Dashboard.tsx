import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaChartBar, FaCog } from 'react-icons/fa';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  link: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, link }) => (
    <Link to={link} className="dashboard-card">
        <div className="card-icon">{icon}</div>
        <h3>{title}</h3>
    </Link>
);

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <div className="dashboard-grid">
        <DashboardCard 
          icon={<FaUsers size={48} />}
          title="Customers"
          link="/customers"
        />
        <DashboardCard 
          icon={<FaChartBar size={48} />}
          title="Analytics"
          link="/analytics"
        />
        <DashboardCard 
          icon={<FaCog size={48} />}
          title="Settings"
          link="/settings"
        />
      </div>
    </div>
  );
};

export default Dashboard;
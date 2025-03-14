import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddCustomer from './components/AddCustomer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/add-customer" element={<AddCustomer />} />
      </Routes>
    </Router>
  );
}

export default App;
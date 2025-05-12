
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Materials from './pages/Materials';
import Inventory from './pages/Inventory';
import Activities from './pages/Activities';

function App() {
  return (
    <div className="p-6">
          <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/activities" element={<Activities />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;

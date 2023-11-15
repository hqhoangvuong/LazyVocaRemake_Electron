import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/auth.context';
import Login from '../pages/login.page';
import Learn from '../pages/learn.page';
import Import from '../pages/import.page';
import Register from '../pages/register.page';
import './App.css';


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/import" element={<Import />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

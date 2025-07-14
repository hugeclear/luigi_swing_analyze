import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SimulationPage from './pages/SimulationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulation" element={<SimulationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

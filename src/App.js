import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Pets from './components/pet/Pets';
import PetDetails from './components/pet/PetDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/pet/:id" element={<PetDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
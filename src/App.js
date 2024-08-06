import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Pets from './components/pet/Pets';
import PetDetails from './components/pet/PetDetails';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (

    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
        <Route path="/pets" element={<ProtectedRoute component={Pets} />} />
        <Route path="/pet/:id" element={<ProtectedRoute component={PetDetails} />} />
      </Routes>
    </div>
  );
}

export default App;

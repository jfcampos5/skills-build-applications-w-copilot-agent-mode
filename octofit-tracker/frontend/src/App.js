


import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Home from './components/Home';


function App() {
  const [authUser, setAuthUser] = useState(null);
  const handleLogout = () => setAuthUser(null);
  return (
    <Router>
      <div className="App container py-4">
        <nav className="navbar navbar-expand-lg octofit-navbar mb-4 rounded shadow">
          <div className="container-fluid">
            <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
              <img src="/octofitapp-small.png" alt="OctoFit Logo" style={{height: '40px', marginRight: '12px'}} className="octofit-logo" />
              OctoFit Tracker
            </NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">Início</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/users">Usuários</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/teams">Times</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/activities">Atividades</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/workouts">Treinos</NavLink>
                </li>
                {authUser ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/dashboard">Painel</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/profile">Perfil</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/settings">Configurações</NavLink>
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-link nav-link" style={{color:'#fff'}} onClick={handleLogout}>Sair</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/login">Entrar</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/register">Registrar</NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile authUser={authUser} />} />
          <Route path="/dashboard" element={<Dashboard authUser={authUser} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

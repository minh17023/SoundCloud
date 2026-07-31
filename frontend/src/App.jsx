import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Login from './pages/Login';
import SongDetails from './pages/SongDetails';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for token and user
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div style={{display:'flex', height:'100vh', justifyContent:'center', alignItems:'center', color:'white'}}>Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Header user={user} onLogout={handleLogout} />
        <div className="main-content-wrapper">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/song/:id" element={<SongDetails user={user} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <AudioPlayer />
      </div>
    </Router>
  );
}

export default App;

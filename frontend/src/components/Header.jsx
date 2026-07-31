import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Mail, User, LogOut } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <svg viewBox="0 0 100 32" className="logo-svg" width="60" height="32" fill="currentColor">
            {/* Simple cloud-like shape representing soundcloud logo */}
            <path d="M 20 20 Q 20 10 30 10 Q 35 10 40 15 Q 45 5 55 5 Q 70 5 70 20 Z" />
            <rect x="75" y="10" width="4" height="10" />
            <rect x="82" y="5" width="4" height="15" />
            <rect x="89" y="12" width="4" height="8" />
          </svg>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-item active">Home</Link>
          <Link to="#" className="nav-item">Feed</Link>
          <Link to="#" className="nav-item">Library</Link>
        </nav>
      </div>

      <div className="header-center">
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button className="search-btn"><Search size={18} /></button>
        </div>
      </div>

      <div className="header-right">
        <Link to="#" className="try-pro">Try Artist Pro</Link>
        <Link to="/upload" className="nav-item">Upload</Link>
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn"><Mail size={20} /></button>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#ccc', fontSize: '14px' }}>{user.username}</span>
            <button className="icon-btn" onClick={onLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button className="icon-btn"><User size={20} /></button>
        )}
      </div>
    </header>
  );
};

export default Header;

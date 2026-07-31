import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">ARTIST TOOLS</h3>
        <div className="tools-grid">
          <div className="tool-item">
            <span className="tool-icon">⚡</span>
            Amplify
          </div>
          <div className="tool-item">
            <span className="tool-icon">🔄</span>
            Replace
          </div>
          <div className="tool-item">
            <span className="tool-icon">🌐</span>
            Distribute
          </div>
          <div className="tool-item">
            <span className="tool-icon">🎛️</span>
            Master
          </div>
        </div>
        <div className="unlock-pro">
          <span className="unlock-icon">+</span>
          Unlock Artist tools from ₫40,000/month.
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">ARTISTS YOU SHOULD FOLLOW</h3>
          <button className="refresh-btn">Refresh list</button>
        </div>
        
        <div className="artist-list">
          {[
            { name: 'Travis Scott', followers: '6.81M', tracks: '174', img: 'https://i.pravatar.cc/150?u=travis' },
            { name: 'Bad-Bunny', followers: '3.43M', tracks: '169', img: 'https://i.pravatar.cc/150?u=bunny' },
            { name: 'DOJA CAT', followers: '2.24M', tracks: '161', img: 'https://i.pravatar.cc/150?u=doja' }
          ].map((artist, idx) => (
            <div key={idx} className="artist-card">
              <img src={artist.img} alt={artist.name} className="artist-avatar" />
              <div className="artist-info">
                <div className="artist-name">{artist.name} <span className="verified-badge">✓</span></div>
                <div className="artist-stats">
                  👥 {artist.followers} • 🎵 {artist.tracks}
                </div>
              </div>
              <button className="follow-btn">Follow</button>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="mobile-apps">
          <h4>GO MOBILE</h4>
          <div className="app-buttons">
            <button className="store-btn">App Store</button>
            <button className="store-btn">Google Play</button>
          </div>
        </div>
        <div className="footer-links">
          Legal - Privacy - Cookie Policy - Imprint - Artist Resources - Newsroom
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

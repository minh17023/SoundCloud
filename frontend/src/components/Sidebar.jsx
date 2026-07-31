import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playlistApi } from '../api/playlist.api';
import useStore from '../store';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  const isSidebarOpen = useStore(state => state.isSidebarOpen);
  const [playlists, setPlaylists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const fetchPlaylists = async () => {
    if (!user) return;
    try {
      const data = await playlistApi.getUserPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  const handleCreatePlaylist = async () => {
    if (!newTitle.trim()) return;
    try {
      await playlistApi.create(newTitle, null);
      setNewTitle('');
      setIsCreating(false);
      fetchPlaylists(); // Refresh list
    } catch (error) {
      alert('Error creating playlist');
    }
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-section">
        <h3 className="sidebar-title">YOUR PLAYLISTS</h3>
        <div className="playlists-list">
          {user ? (
            <>
              {playlists.map(pl => (
                <Link to={`/playlist/${pl.id}`} key={pl.id} className="playlist-item" style={{display:'block', padding:'5px 0', color:'#ccc', textDecoration:'none'}}>
                  🎵 {pl.title}
                </Link>
              ))}
              
              {!isCreating ? (
                <button onClick={() => setIsCreating(true)} className="btn btn-secondary" style={{marginTop:'10px', width:'100%', padding:'5px'}}>
                  + New Playlist
                </button>
              ) : (
                <div style={{marginTop:'10px'}}>
                  <input 
                    type="text" 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    placeholder="Playlist name..."
                    style={{width:'100%', marginBottom:'5px', padding:'5px'}}
                  />
                  <div style={{display:'flex', gap:'5px'}}>
                    <button onClick={handleCreatePlaylist} className="btn btn-primary" style={{flex:1, padding:'5px'}}>Save</button>
                    <button onClick={() => setIsCreating(false)} className="btn btn-secondary" style={{flex:1, padding:'5px'}}>Cancel</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p style={{color:'#777'}}>Please login to see your playlists.</p>
          )}
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
    </aside>
  );
};

export default Sidebar;

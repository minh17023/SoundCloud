import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { playlistApi } from '../api/playlist.api';
import useStore from '../store';
import { Play } from 'lucide-react';
import './PlaylistDetails.css';

const PlaylistDetails = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const setTrack = useStore(state => state.setTrack);
  const setIsPlaying = useStore(state => state.setIsPlaying);
  const setQueue = useStore(state => state.setQueue);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await playlistApi.getById(id);
        setPlaylist(data);
      } catch (error) {
        console.error('Error fetching playlist', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading playlist...</div>;
  if (!playlist) return <div style={{ color: 'white', padding: '20px' }}>Playlist not found.</div>;

  const handlePlayAll = () => {
    if (!playlist.Songs || playlist.Songs.length === 0) return;
    
    // Map to queue format
    const queue = playlist.Songs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.uploader?.username || 'Unknown',
      url: song.audio_url,
      cover: song.cover_image
    }));

    setQueue(queue);
    setTrack(queue[0]);
    setIsPlaying(true);
  };

  const handlePlaySong = (song) => {
    setTrack({
      id: song.id,
      title: song.title,
      artist: song.uploader?.username || 'Unknown',
      url: song.audio_url,
      cover: song.cover_image
    });
    setIsPlaying(true);
  };

  return (
    <div className="playlist-details-container">
      <div className="playlist-header">
        <img 
          src={playlist.cover_image || 'https://via.placeholder.com/200?text=Playlist'} 
          alt={playlist.title} 
          className="playlist-cover"
        />
        <div className="playlist-info">
          <h2>{playlist.title}</h2>
          <p>Created by: {playlist.User?.username}</p>
          <p>{playlist.Songs?.length || 0} tracks</p>
          <button className="btn btn-primary" onClick={handlePlayAll}>Play All</button>
        </div>
      </div>

      <div className="playlist-tracks">
        <h3>Tracks</h3>
        {playlist.Songs && playlist.Songs.length > 0 ? (
          <ul className="track-list">
            {playlist.Songs.map((song, index) => (
              <li key={song.id} className="track-item">
                <span className="track-number">{index + 1}</span>
                <img src={song.cover_image || 'https://via.placeholder.com/50'} alt={song.title} className="track-thumb" />
                <div className="track-details">
                  <Link to={`/song/${song.id}`} className="track-title">{song.title}</Link>
                  <span className="track-artist">{song.uploader?.username}</span>
                </div>
                <button className="track-play-btn" onClick={() => handlePlaySong(song)}>
                  <Play size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#888' }}>This playlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails;

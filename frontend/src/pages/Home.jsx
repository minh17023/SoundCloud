import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { songApi } from '../api/song.api';
import useStore from '../store';
import { Play } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const setTrack = useStore((state) => state.setTrack);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const setQueue = useStore((state) => state.setQueue);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await songApi.getAll();
        if (data && data.length > 0) {
          setSongs(data);
          const q = data.map(s => ({
            id: s.id,
            title: s.title,
            artist: s.uploader?.username || 'Unknown',
            url: s.audio_url,
            cover: s.cover_image
          }));
          setQueue(q);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, [setQueue]);

  const handlePlay = (song) => {
    setTrack({
      id: song.id,
      title: song.title,
      artist: song.uploader?.username || 'Unknown',
      url: song.audio_url,
      cover: song.cover_image
    });
    setIsPlaying(true);
  };

  const moreOfWhatYouLike = songs.slice(0, 4);
  const recentlyPlayed = songs.slice(2, 7);

  return (
    <div className="home-container">
      {/* SECTION 1: More of what you like */}
      <section className="home-section">
        <h2 className="section-title">More of what you like</h2>
        <p className="section-subtitle">Suggestions based on what you've liked or played</p>
        
        <div className="grid-container">
          {moreOfWhatYouLike.map((song) => (
            <div key={`more-${song.id}`} className="song-card square-card">
              <div className="card-image-wrapper">
                <img src={song.cover_image || 'https://via.placeholder.com/150'} alt={song.title} />
                <div className="play-overlay" onClick={() => handlePlay(song)}>
                  <div className="play-btn-round"><Play size={24} fill="currentColor" /></div>
                </div>
              </div>
              <Link to={`/song/${song.id}`} className="song-title">{song.title}</Link>
              <div className="song-artist">{song.uploader?.username || 'Unknown'}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Recently Played */}
      <section className="home-section recently-played-section">
        <h2 className="section-title">Recently Played</h2>
        <div className="list-container">
          {recentlyPlayed.map((song) => (
            <div key={`recent-${song.id}`} className="list-item">
              <div className="list-item-left">
                <div className="list-image-wrapper">
                  <img src={song.cover_image || 'https://via.placeholder.com/50'} alt={song.title} />
                  <div className="play-overlay" onClick={() => handlePlay(song)}>
                     <Play size={16} fill="currentColor" />
                  </div>
                </div>
                <div className="list-item-info">
                  <Link to={`/song/${song.id}`} className="list-title">{song.title}</Link>
                  <span className="list-artist">{song.uploader?.username || 'Unknown'}</span>
                </div>
              </div>
              <div className="list-item-right">
                <span className="play-count">▶ {(song.listens || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

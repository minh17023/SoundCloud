import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { songApi } from '../api/song.api';
import useStore from '../store';
import './Home.css';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const setTrack = useStore((state) => state.setTrack);
  const setIsPlaying = useStore((state) => state.setIsPlaying);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await songApi.getAll();
        if (data && data.length > 0) {
          setSongs(data);
        } else {
          setSongs([
            { id: 1, title: 'No songs uploaded yet', uploader: { username: 'System' }, cover_image: 'https://i.pravatar.cc/200?u=1' }
          ]);
        }
      } catch (error) {
        console.error('Lỗi khi tải bài hát:', error);
      }
    };
    
    fetchSongs();
  }, []);

  const handlePlay = (e, song) => {
    e.preventDefault();
    if (!song.audio_url) return;
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
    <div className="home-container">
      <section className="home-section">
        <h2 className="section-title">Trending by genre</h2>
        <div className="cards-grid">
          {songs.map((song) => (
            <div key={song.id} className="music-card">
              <div className="card-image-wrapper">
                <img src={song.cover_image || song.img} alt={song.title} className="card-image" />
                <button className="play-overlay" onClick={(e) => handlePlay(e, song)}>▶</button>
              </div>
              <Link to={`/song/${song.id}`} className="card-link" style={{textDecoration: 'none', color: 'inherit'}}>
                <h4 className="card-title">{song.title}</h4>
              </Link>
              <p className="card-subtitle">{song.uploader?.username || song.artist}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section mt-8">
        <h2 className="section-title">Artists to watch out for</h2>
        <div className="cards-grid">
          {[
            { id: 5, title: 'Buzzing Pop', tag: 'Pop', isNew: true, img: 'https://i.pravatar.cc/200?u=5' },
            { id: 6, title: 'Buzzing Electronic', tag: 'Electronic', isNew: true, img: 'https://i.pravatar.cc/200?u=6' },
            { id: 7, title: 'Buzzing Rock', tag: 'Rock', isNew: true, img: 'https://i.pravatar.cc/200?u=7' },
            { id: 8, title: 'Buzzing Metal', tag: 'Metal', isNew: true, img: 'https://i.pravatar.cc/200?u=8' }
          ].map((playlist) => (
            <div key={playlist.id} className="music-card buzz-card">
              <div className="card-image-wrapper">
                <div className="buzz-tag">BUZZING</div>
                <img src={playlist.img} alt={playlist.title} className="card-image" />
              </div>
              <h4 className="card-title">{playlist.title}</h4>
              {playlist.isNew && <p className="card-subtitle new-badge">New!</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

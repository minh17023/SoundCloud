import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { songApi } from '../api/song.api';
import { interactionApi } from '../api/interaction.api';
import { playlistApi } from '../api/playlist.api';
import useStore from '../store';
import { Play, Heart, MessageSquare, Plus } from 'lucide-react';
import './SongDetails.css';

const SongDetails = ({ user }) => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Playlist state
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  
  const currentTrack = useStore(state => state.currentTrack);
  const isPlaying = useStore(state => state.isPlaying);
  const setTrack = useStore(state => state.setTrack);
  const setIsPlaying = useStore(state => state.setIsPlaying);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songData, commentsData] = await Promise.all([
          songApi.getById(id),
          interactionApi.getComments(id)
        ]);
        setSong(songData);
        setComments(commentsData);
        
        if (user) {
          const plData = await playlistApi.getUserPlaylists();
          setUserPlaylists(plData);
        }
      } catch (error) {
        console.error('Error fetching song details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  if (loading) return <div style={{ color: 'white' }}>Loading details...</div>;
  if (!song) return <div style={{ color: 'white' }}>Song not found.</div>;

  const handlePlay = () => {
    if (currentTrack?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setTrack({
        id: song.id,
        title: song.title,
        artist: song.uploader?.username || 'Unknown',
        url: song.audio_url,
        cover: song.cover_image || 'https://via.placeholder.com/150'
      });
      setIsPlaying(true);
    }
  };

  const handleLike = async () => {
    if (!user) return alert('Please login to like this song.');
    try {
      await interactionApi.toggleLike(song.id);
      setSong({ ...song, listens: (song.listens || 0) + 1 }); 
      alert('Toggled Like!');
    } catch (error) {
      alert('Error toggling like');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) return alert('Please login to comment.');

    try {
      const commentData = await interactionApi.addComment(song.id, newComment, 0);
      setComments([...comments, commentData]);
      setNewComment('');
    } catch (error) {
      alert('Error adding comment');
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistApi.addSong(playlistId, song.id);
      alert('Added to playlist successfully!');
      setShowPlaylists(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Error adding to playlist');
    }
  };

  const isCurrentTrackPlaying = currentTrack?.id === song.id && isPlaying;

  return (
    <div className="song-details-container">
      <div className="song-details-header">
        <button className="song-details-play-btn" onClick={handlePlay}>
          {isCurrentTrackPlaying ? <div className="pause-icon-large" /> : <Play size={40} fill="currentColor" />}
        </button>
        <div className="song-details-info">
          <h2>{song.title}</h2>
          <p>{song.uploader?.username || 'Unknown Artist'} • {song.genre}</p>
        </div>
      </div>
      
      {song.cover_image && (
        <img src={song.cover_image} alt={song.title} className="song-details-cover" />
      )}

      <div className="song-details-actions">
        <button className="action-btn" onClick={handleLike}>
          <Heart size={20} />
          <span>{song.listens || 0} Likes</span>
        </button>
        <button className="action-btn">
          <MessageSquare size={20} />
          <span>{comments.length} Comments</span>
        </button>
        
        {user && (
          <div style={{position: 'relative'}}>
            <button className="action-btn" onClick={() => setShowPlaylists(!showPlaylists)}>
              <Plus size={20} />
              <span>Add to Playlist</span>
            </button>
            {showPlaylists && (
              <div style={{position: 'absolute', top: '100%', left: 0, background: '#222', border: '1px solid #444', borderRadius: '4px', padding: '10px', zIndex: 10, width: '200px'}}>
                <h4 style={{margin: '0 0 10px 0', fontSize: '14px'}}>Select Playlist</h4>
                {userPlaylists.length > 0 ? userPlaylists.map(pl => (
                  <button 
                    key={pl.id} 
                    style={{display: 'block', width: '100%', padding: '5px', textAlign: 'left', background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer'}}
                    onClick={() => handleAddToPlaylist(pl.id)}
                  >
                    {pl.title}
                  </button>
                )) : (
                  <p style={{fontSize: '12px', color: '#888'}}>No playlists found. Create one in the sidebar.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="song-details-comments">
        <h3>Comments</h3>
        
        <form onSubmit={handleAddComment} className="comment-form">
          <input 
            type="text" 
            placeholder="Write a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
          />
        </form>

        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <strong>{c.User?.username || 'User'}: </strong>
              <span>{c.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongDetails;

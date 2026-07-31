import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import useStore from '../store';
import { Play, Heart, MessageSquare } from 'lucide-react';
import './SongDetails.css';

const SongDetails = ({ user }) => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  
  const currentTrack = useStore(state => state.currentTrack);
  const isPlaying = useStore(state => state.isPlaying);
  const setTrack = useStore(state => state.setTrack);
  const setIsPlaying = useStore(state => state.setIsPlaying);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songData, commentsData] = await Promise.all([
          axiosClient.get(`/songs/${id}`),
          axiosClient.get(`/interactions/comment/${id}`)
        ]);
        setSong(songData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching song details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
      await axiosClient.post('/interactions/like', { songId: song.id });
      // Very simple local update (in a real app we'd fetch the updated count from the server)
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
      const commentData = await axiosClient.post('/interactions/comment', {
        songId: song.id,
        content: newComment,
        timestamp: 0 // Mock timestamp for now
      });
      setComments([...comments, commentData]);
      setNewComment('');
    } catch (error) {
      alert('Error adding comment');
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

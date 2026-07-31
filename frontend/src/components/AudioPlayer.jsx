import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, ListMusic } from 'lucide-react';
import useStore from '../store';
import { songApi } from '../api/song.api';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const currentTrack = useStore((state) => state.currentTrack);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const playNext = useStore((state) => state.playNext);
  const playPrev = useStore((state) => state.playPrev);
  
  // New Store States
  const volume = useStore(state => state.volume);
  const setVolume = useStore(state => state.setVolume);
  const isShuffle = useStore(state => state.isShuffle);
  const toggleShuffle = useStore(state => state.toggleShuffle);
  const repeatMode = useStore(state => state.repeatMode);
  const toggleRepeat = useStore(state => state.toggleRepeat);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDraggingTime, setIsDraggingTime] = useState(false);
  const [hasCountedPlay, setHasCountedPlay] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    // Reset play count tracking when track changes
    setHasCountedPlay(false);
  }, [currentTrack]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (!isDraggingTime) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      
      // Count play if listened for 30 seconds (or half the song if it's very short)
      if (!hasCountedPlay && duration > 0) {
        const targetTime = Math.min(15, duration / 2);
        if (time >= targetTime) {
          setHasCountedPlay(true);
          if (currentTrack && currentTrack.id) {
            songApi.recordPlay(currentTrack.id).catch(err => console.error("Failed to record play:", err));
          }
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  // --- Timeline Seeking ---
  const handleSeekStart = (e) => {
    setIsDraggingTime(true);
    updateSeekPosition(e);
  };

  const handleSeekMove = (e) => {
    if (isDraggingTime) {
      updateSeekPosition(e);
    }
  };

  const handleSeekEnd = (e) => {
    if (isDraggingTime) {
      updateSeekPosition(e);
      setIsDraggingTime(false);
    }
  };

  const updateSeekPosition = (e) => {
    const bar = document.getElementById('timeline-bar');
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    let clickPosition = e.clientX - rect.left;
    if (clickPosition < 0) clickPosition = 0;
    if (clickPosition > rect.width) clickPosition = rect.width;
    
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
    if (audioRef.current && !isDraggingTime) { // Only set actual audio time on click or end of drag
      audioRef.current.currentTime = newTime;
    }
  };

  // Sync actual audio time when dragging stops
  useEffect(() => {
    if (!isDraggingTime && audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 1) {
       audioRef.current.currentTime = currentTime;
    }
  }, [isDraggingTime]);

  useEffect(() => {
    const handleMouseUp = (e) => {
      if(isDraggingTime) handleSeekEnd(e);
    }
    const handleMouseMove = (e) => {
      if(isDraggingTime) handleSeekMove(e);
    }
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isDraggingTime, duration]);

  // --- Volume ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    let clickPosition = e.clientX - rect.left;
    if(clickPosition < 0) clickPosition = 0;
    if(clickPosition > rect.width) clickPosition = rect.width;
    
    const newVolume = clickPosition / rect.width;
    setVolume(newVolume);
    if(isMuted && newVolume > 0) setIsMuted(false);
  };

  // --- Play/Pause Sync ---
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay prevented', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleEnded = () => {
    if (repeatMode === 2) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="audio-player">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="player-inner">
        <div className="player-controls">
          <button className="control-btn" onClick={playPrev}><SkipBack size={20} fill="currentColor" /></button>
          <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause fill="black" stroke="black" size={20} /> : <Play fill="black" stroke="black" size={20} className="play-icon-offset" />}
          </button>
          <button className="control-btn" onClick={playNext}><SkipForward size={20} fill="currentColor" /></button>
          <button className={`control-btn ${isShuffle ? 'active' : ''}`} onClick={toggleShuffle}>
            <Shuffle size={18} />
          </button>
          <button className={`control-btn ${repeatMode !== 0 ? 'active' : ''}`} onClick={toggleRepeat}>
            <Repeat size={18} />
            {repeatMode === 2 && <span className="repeat-one-badge">1</span>}
          </button>
        </div>

        <div className="player-timeline">
          <span className="time">{formatTime(currentTime)}</span>
          <div 
            id="timeline-bar"
            className="progress-bar-container" 
            onMouseDown={handleSeekStart}
          >
            <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div>
          </div>
          <span className="time">{formatTime(duration)}</span>
          <div className="player-volume-wrapper">
            <button className="volume-icon-btn" onClick={() => setIsMuted(!isMuted)}>
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="volume-hover-area">
              <div className="volume-bar-container" onClick={handleVolumeChange}>
                <div className="volume-bar" style={{ width: `${isMuted ? 0 : volume * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="player-track-info">
          <img src={currentTrack.cover || 'https://via.placeholder.com/100'} alt="track cover" className="track-cover" />
          <div className="track-details">
            <div className="track-artist">{currentTrack.artist}</div>
            <div className="track-title">{currentTrack.title}</div>
          </div>
          <div className="track-actions">
            <button className="control-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
            <button className="control-btn"><ListMusic size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

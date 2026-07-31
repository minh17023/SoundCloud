import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import useStore from '../store';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const currentTrack = useStore((state) => state.currentTrack);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const playNext = useStore((state) => state.playNext);
  const playPrev = useStore((state) => state.playPrev);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const clickPosition = e.clientX - bar.getBoundingClientRect().left;
    const percentage = clickPosition / bar.offsetWidth;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay prevented', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  return (
    <div className="audio-player">
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={playNext}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="player-controls">
        <button className="control-btn"><Shuffle size={16} /></button>
        <button className="control-btn" onClick={playPrev}><SkipBack size={20} /></button>
        <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
        </button>
        <button className="control-btn" onClick={playNext}><SkipForward size={20} /></button>
        <button className="control-btn"><Repeat size={16} /></button>
      </div>

      <div className="player-timeline">
        <span className="time">{formatTime(currentTime)}</span>
        <div className="progress-bar-container" onClick={handleSeek} style={{ cursor: 'pointer' }}>
          <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div>
        </div>
        <span className="time">{formatTime(duration)}</span>
      </div>

      <div className="player-track-info">
        <img src={currentTrack.img || 'https://i.pravatar.cc/100'} alt="track cover" className="track-cover" />
        <div className="track-details">
          <div className="track-artist">{currentTrack.artist}</div>
          <div className="track-title">{currentTrack.title}</div>
        </div>
      </div>

      <div className="player-volume">
        <Volume2 size={18} />
        <div className="volume-bar-container">
          <div className="volume-bar" style={{ width: '80%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

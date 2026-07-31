import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import './Upload.css';

const Upload = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleAudioChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      alert("Please select an audio file to upload");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('audio', audioFile);
    if (imageFile) formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('genre', genre);

    try {
      await axiosClient.post('/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Upload successful!');
      navigate('/');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2>Upload to SoundCloud</h2>
        <p>Share your music with the world.</p>
      </div>

      <div className="upload-content">
        <div className="upload-dropzone">
          <UploadCloud size={48} className="upload-icon" />
          <h3>Drag and drop your tracks & albums here</h3>
          <p>or</p>
          <label className="btn btn-primary upload-btn">
            Choose files to upload
            <input type="file" accept="audio/*" onChange={handleAudioChange} hidden />
          </label>
          <p className="upload-info">Provide FLAC, WAV, ALAC, or AIFF for highest audio quality. <a href="#">Learn more</a></p>
        </div>

        {audioFile && (
          <form className="upload-form" onSubmit={handleUpload}>
            <div className="form-group">
              <label>Selected File</label>
              <div className="selected-file">{audioFile.name}</div>
            </div>

            <div className="form-group">
              <label>Cover Image</label>
              <div className="cover-image-upload-wrapper">
                <input type="file" accept="image/*" onChange={handleImageChange} className="image-upload" id="cover-upload" hidden />
                <label htmlFor="cover-upload" className="cover-upload-label">
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Cover Preview" className="cover-preview" />
                  ) : (
                    <div className="cover-upload-placeholder">
                      <span>Click to select cover</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Name your track" />
            </div>

            <div className="form-group">
              <label>Artist</label>
              <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Travis Scott" />
            </div>

            <div className="form-group">
              <label>Genre</label>
              <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="">None</option>
                <option value="Electronic">Electronic</option>
                <option value="Pop">Pop</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Rock">Rock</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setAudioFile(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Upload;

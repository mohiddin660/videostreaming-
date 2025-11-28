import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    privacy: 'PUBLIC',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api';

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid video file (MP4, WebM, or OGG)');
        return;
      }
      
      // Validate file size (500MB limit)
      if (file.size > 500 * 1024 * 1024) {
        toast.error('Video file size must be less than 500MB');
        return;
      }
      
      setVideoFile(file);
      
      // Create video preview URL
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }
    
    if (!thumbnailFile) {
      toast.error('Please select a thumbnail image');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a video title');
      return;
    }

    setUploading(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('video', videoFile);
      uploadData.append('thumbnail', thumbnailFile);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('privacy', formData.privacy);

      const response = await axios.post(`${API_BASE_URL}/videos/upload`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      toast.success('Video uploaded successfully!');
      
      // Clear form
      setFormData({
        title: '',
        description: '',
        category: '',
        privacy: 'PUBLIC',
      });
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(null);
      
      // Navigate to profile to see uploaded video
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data || 'Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload Video</h1>
      
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoFileChange}
            className="file-input"
            disabled={uploading}
          />
          {videoFile && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>
                Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
              {videoPreview && (
                <video 
                  src={videoPreview} 
                  controls 
                  style={{ 
                    width: '100%', 
                    maxWidth: '400px', 
                    height: 'auto',
                    borderRadius: '8px',
                    backgroundColor: '#000'
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Thumbnail Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailFileChange}
            className="file-input"
            disabled={uploading}
          />
          {thumbnailFile && (
            <p style={{ color: '#aaa', fontSize: '14px', marginTop: '5px' }}>
              Selected: {thumbnailFile.name}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title" className="form-label">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter video title"
            disabled={uploading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Tell viewers about your video"
            disabled={uploading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select"
            disabled={uploading}
          >
            <option value="">Select a category</option>
            <option value="Gaming">Gaming</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Education">Education</option>
            <option value="Music">Music</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="News">News</option>
            <option value="Comedy">Comedy</option>
            <option value="Travel">Travel</option>
            <option value="Cooking">Cooking</option>
            <option value="DIY">DIY & Crafts</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="privacy" className="form-label">Privacy</label>
          <select
            id="privacy"
            name="privacy"
            value={formData.privacy}
            onChange={handleInputChange}
            className="form-select"
            disabled={uploading}
          >
            <option value="PUBLIC">Public - Anyone can watch</option>
            <option value="UNLISTED">Unlisted - Only people with the link can watch</option>
            <option value="PRIVATE">Private - Only you can watch</option>
          </select>
        </div>

        {uploading && (
          <div className="upload-progress">
            <div 
              className="upload-progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={uploading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {uploading ? (
            <>
              <Upload size={20} />
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload Video
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
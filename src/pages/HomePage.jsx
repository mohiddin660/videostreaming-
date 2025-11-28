import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { demoVideos } from '../data/demoVideos';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      // Try to fetch from backend first
      const response = await axios.get(`${API_BASE_URL}/videos/public`);
      setVideos(response.data.content || []);
    } catch (error) {
      console.log('Backend not available, using demo videos');
      // If backend is not available, use demo videos
      setVideos(demoVideos);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="home-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading videos...
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1>Trending Videos</h1>
      
      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>No videos available. Be the first to upload!</p>
          <Link to="/upload" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Upload Video
          </Link>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <Link 
              key={video.id} 
              to={`/watch/${video.id}`} 
              className="video-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img
                src={video.thumbnailUrl || `${API_BASE_URL}${video.thumbnailUrl}` || 'https://via.placeholder.com/300x180?text=Video+Thumbnail'}
                alt={video.title}
                className="video-thumbnail"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x180?text=No+Thumbnail';
                }}
              />
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-channel">{video.user?.fullName || video.user?.username}</p>
                <p className="video-stats">
                  {formatViews(video.viewsCount || video.viewCount || 0)} • {formatDate(video.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
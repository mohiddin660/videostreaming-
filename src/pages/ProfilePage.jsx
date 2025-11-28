import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyVideos();
    }
  }, [isAuthenticated]);

  const fetchMyVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/videos/my-videos`);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load your videos');
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <h1>Please sign in to view your profile</h1>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1>My Channel</h1>
          <p style={{ color: '#aaa', marginTop: '5px' }}>
            Welcome back, {user?.fullName || user?.username}!
          </p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          Upload New Video
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading your videos...
        </div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No videos uploaded yet</h3>
          <p style={{ color: '#aaa', margin: '20px 0' }}>
            Start sharing your content with the world!
          </p>
          <Link to="/upload" className="btn btn-primary">
            Upload Your First Video
          </Link>
        </div>
      ) : (
        <>
          <h2>My Videos ({videos.length})</h2>
          <div className="video-grid">
            {videos.map((video) => (
              <div key={video.id} className="video-card">
                <Link to={`/video/${video.id}`}>
                  <img
                    src={`${API_BASE_URL}${video.thumbnailUrl}`}
                    alt={video.title}
                    className="video-thumbnail"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x180?text=No+Thumbnail';
                    }}
                  />
                </Link>
                <div className="video-info">
                  <Link 
                    to={`/video/${video.id}`} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3 className="video-title">{video.title}</h3>
                  </Link>
                  <p className="video-stats">
                    {formatViews(video.viewCount)} • {formatDate(video.createdAt)}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginTop: '8px' 
                  }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: video.videoStatus === 'READY' ? '#0d7c0d' : '#b3790d'
                    }}>
                      {video.videoStatus}
                    </span>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: video.privacyStatus === 'PUBLIC' ? '#065fd4' : '#606060'
                    }}>
                      {video.privacyStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
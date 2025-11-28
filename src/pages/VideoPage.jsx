import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getDemoVideoById, demoVideos } from '../data/demoVideos';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    if (id) {
      fetchVideo();
      fetchRelatedVideos();
    }
  }, [id]);

  const fetchVideo = async () => {
    try {
      // Try to fetch from backend first
      const response = await axios.get(`${API_BASE_URL}/videos/${id}`);
      setVideo(response.data);
    } catch (error) {
      console.log('Backend not available, using demo video');
      // If backend is not available, use demo video
      const demoVideo = getDemoVideoById(id);
      if (demoVideo) {
        setVideo(demoVideo);
      } else {
        toast.error('Video not found');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/videos/public?page=0&size=10`);
      setRelatedVideos(response.data.content || []);
    } catch (error) {
      console.log('Backend not available, using demo videos for related');
      // Use demo videos as related videos
      setRelatedVideos(demoVideos.filter(v => v.id !== parseInt(id)).slice(0, 10));
    }
  };

  const handleLike = () => {
    fetchVideo(); // Refresh video data to get updated like count
  };

  const handleDislike = () => {
    fetchVideo(); // Refresh video data to get updated dislike count
  };

  const handleComment = () => {
    // Comment functionality is handled within VideoPlayer
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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="video-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading video...
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Video not found
        </div>
      </div>
    );
  }

  return (
    <div className="video-page">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-6">
        {/* Main Video Section */}
        <div className="flex-1">
          <VideoPlayer
            video={video}
            onLike={handleLike}
            onDislike={handleDislike}
            onComment={handleComment}
          />
        </div>

        {/* Sidebar with Related Videos */}
        <div className="lg:w-96 flex-shrink-0">
          <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
          <div className="space-y-4">
            {relatedVideos.slice(0, 10).map(relatedVideo => (
              <div
                key={relatedVideo.id}
                className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => window.location.href = `/watch/${relatedVideo.id}`}
              >
                <div className="w-40 h-24 flex-shrink-0">
                  <img
                    src={relatedVideo.thumbnailUrl || '/api/placeholder/160/90'}
                    alt={relatedVideo.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2 mb-1">
                    {relatedVideo.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {relatedVideo.user?.username}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatViews(relatedVideo.viewsCount)} • {formatDate(relatedVideo.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
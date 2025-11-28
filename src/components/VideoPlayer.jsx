import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const VideoPlayer = ({ video, onClose }) => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'John Doe',
      text: 'Great video! Really enjoyed watching this.',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      user: 'Jane Smith',
      text: 'Amazing content, keep it up!',
      timestamp: '1 day ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (video?.videoUrl) {
      // Check if video URL is external (YouTube, Vimeo, etc.)
      const isExternalVideo = video.videoUrl.includes('youtube.com') || 
                             video.videoUrl.includes('youtu.be') || 
                             video.videoUrl.includes('vimeo.com') ||
                             video.videoUrl.includes('dailymotion.com');
      setUseIframe(isExternalVideo);
    }
  }, [video]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }
    };

    video.addEventListener('progress', updateBuffered);
    return () => video.removeEventListener('progress', updateBuffered);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;

    const comment = {
      id: Date.now(),
      user: user.username || 'Anonymous',
      text: newComment.trim(),
      timestamp: 'Just now'
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  if (!video) return null;

  const renderVideoPlayer = () => {
    if (useIframe) {
      // For external videos or when iframe is preferred
      return (
        <iframe
          className="video-player-iframe"
          src={video.videoUrl}
          title={video.title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      );
    } else {
      // For local videos with custom controls
      return (
        <div 
          className="custom-video-player"
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
            poster={video.thumbnailUrl}
          >
            <source src={video.videoUrl || `http://localhost:8080/videos/stream/${video.id}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Custom Video Controls */}
          <div className={`video-controls-overlay ${showControls ? '' : 'hidden'}`}>
            {/* Progress Bar */}
            <div className="video-progress-bar" onClick={handleSeek}>
              <div 
                className="video-progress-buffer"
                style={{ width: `${buffered}%` }}
              />
              <div 
                className="video-progress-current"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="video-controls-row">
              <div className="video-controls-left">
                <button onClick={togglePlay} className="video-control-btn play-pause-btn">
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                
                <div className="volume-control">
                  <button onClick={toggleMute} className="video-control-btn">
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>

                <span className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="video-controls-right">
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                  className="speed-selector"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="quality-selector"
                >
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                  <option value="360p">360p</option>
                </select>

                <button onClick={toggleFullscreen} className="video-control-btn">
                  📺
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="video-player-container">
      {/* Close Button */}
      {onClose && (
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      )}

      {/* Video Player */}
      <div className="video-player-wrapper">
        {renderVideoPlayer()}
      </div>

      {/* Video Info */}
      <div className="video-info-section">
        <h2 className="video-title">{video.title}</h2>
        <div className="video-meta-info">
          <div className="video-stats">
            <p className="video-views">{video.views} views • {video.uploadDate}</p>
            <p className="video-channel">{video.channel}</p>
          </div>
          <div className="video-actions">
            <button 
              onClick={handleLike}
              className={`action-btn like-btn ${liked ? 'active' : ''}`}
            >
              <span>👍</span>
              <span>{video.likes + (liked ? 1 : 0)}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`action-btn dislike-btn ${disliked ? 'active' : ''}`}
            >
              <span>👎</span>
              <span>{video.dislikes + (disliked ? 1 : 0)}</span>
            </button>
            <button className="action-btn share-btn">
              <span>↗️</span>
              <span>Share</span>
            </button>
          </div>
        </div>
        <p className="video-description">{video.description}</p>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="comments-title">Comments ({comments.length})</h3>
        
        {/* Add Comment */}
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
            rows="3"
          />
          <div className="comment-actions">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="comment-submit-btn"
            >
              Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                {comment.user[0]?.toUpperCase()}
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-user">{comment.user}</span>
                  <span className="comment-timestamp">{comment.timestamp}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LiveStreamPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [streams, setStreams] = useState([]);
  const [myStreams, setMyStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStream, setNewStream] = useState({
    title: '',
    description: '',
    category: 'Gaming'
  });

  const categories = [
    'Gaming', 'Entertainment', 'Education', 'Music', 'Technology',
    'Sports', 'News', 'Comedy', 'Travel', 'Cooking', 'DIY', 'Other'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchActiveStreams();
    fetchMyStreams();
  }, [user, navigate]);

  const fetchActiveStreams = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/livestream/active');
      if (response.ok) {
        const data = await response.json();
        setStreams(data);
      }
    } catch (error) {
      console.error('Error fetching active streams:', error);
    }
  };

  const fetchMyStreams = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/livestream/my-streams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMyStreams(data);
      }
    } catch (error) {
      console.error('Error fetching my streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStream = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/livestream/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newStream)
      });

      if (response.ok) {
        const streamData = await response.json();
        alert(`Stream created successfully! Your stream key is: ${streamData.streamKey}`);
        setShowCreateForm(false);
        setNewStream({ title: '', description: '', category: 'Gaming' });
        fetchMyStreams();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create stream');
      }
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Failed to create stream');
    }
  };

  const handleStartStream = async (streamId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/livestream/start/${streamId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Stream started successfully!');
        fetchMyStreams();
        fetchActiveStreams();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to start stream');
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      alert('Failed to start stream');
    }
  };

  const handleEndStream = async (streamId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/livestream/end/${streamId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Stream ended successfully!');
        fetchMyStreams();
        fetchActiveStreams();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to end stream');
      }
    } catch (error) {
      console.error('Error ending stream:', error);
      alert('Failed to end stream');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      OFFLINE: 'bg-gray-500',
      STARTING: 'bg-yellow-500',
      LIVE: 'bg-red-500',
      ENDING: 'bg-orange-500'
    };

    return (
      <span className={`px-2 py-1 rounded text-white text-xs ${statusColors[status] || 'bg-gray-500'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Live Streaming</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Create Stream
        </button>
      </div>

      {/* Create Stream Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Stream</h2>
            <form onSubmit={handleCreateStream}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stream Title
                </label>
                <input
                  type="text"
                  value={newStream.title}
                  onChange={(e) => setNewStream({ ...newStream, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={newStream.description}
                  onChange={(e) => setNewStream({ ...newStream, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-24"
                  rows="3"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  value={newStream.category}
                  onChange={(e) => setNewStream({ ...newStream, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Create Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Streams Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Streams</h2>
        {myStreams.length === 0 ? (
          <p className="text-gray-600">You haven't created any streams yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myStreams.map(stream => (
              <div key={stream.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{stream.title}</h3>
                  {getStatusBadge(stream.streamStatus)}
                </div>
                <p className="text-gray-600 mb-4">{stream.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Viewers: {stream.viewerCount}</span>
                  <span>Created: {new Date(stream.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  {stream.streamStatus === 'OFFLINE' && (
                    <button
                      onClick={() => handleStartStream(stream.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                      Start Stream
                    </button>
                  )}
                  {stream.streamStatus === 'LIVE' && (
                    <button
                      onClick={() => handleEndStream(stream.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                      End Stream
                    </button>
                  )}
                </div>
                {stream.streamKey && (
                  <div className="mt-4 p-3 bg-gray-100 rounded">
                    <p className="text-xs text-gray-600">Stream Key:</p>
                    <p className="text-sm font-mono break-all">{stream.streamKey}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Streams Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Live Now</h2>
        {streams.length === 0 ? (
          <p className="text-gray-600">No active streams at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map(stream => (
              <div key={stream.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{stream.title}</h3>
                    {getStatusBadge(stream.streamStatus)}
                  </div>
                  <p className="text-gray-600 mb-4">{stream.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>👤 {stream.viewerCount} watching</span>
                    <span>By: {stream.user?.username || 'Unknown'}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/watch-stream/${stream.id}`)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Watch Stream
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStreamPage;
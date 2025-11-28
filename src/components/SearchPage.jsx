import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchDemoVideos } from '../data/demoVideos';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'relevance',
    duration: '',
    uploadDate: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const query = searchParams.get('q') || '';

  const categories = [
    'Gaming', 'Entertainment', 'Education', 'Music', 'Technology',
    'Sports', 'News', 'Comedy', 'Travel', 'Cooking', 'DIY', 'Other'
  ];

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query, filters, currentPage]);

  const searchVideos = async () => {
    setLoading(true);
    try {
      // Try backend search first
      const params = new URLSearchParams({
        query: query,
        page: currentPage.toString(),
        size: '12'
      });

      if (filters.category) {
        params.append('category', filters.category);
      }

      try {
        const response = await fetch(`http://localhost:8080/videos/search?${params}`);
        if (response.ok) {
          const data = await response.json();
          setVideos(data.content || []);
          setTotalPages(data.totalPages || 0);
          setHasMore(data.hasNext || false);
        } else {
          throw new Error('Backend not available');
        }
      } catch (error) {
        console.log('Backend not available, using demo search');
        // Fallback to demo videos search
        const searchResults = searchDemoVideos(query, filters.category);
        setVideos(searchResults);
        setTotalPages(1);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleVideoClick = (video) => {
    navigate(`/watch/${video.id}`);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count?.toString() || '0';
  };

  const formatUploadDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffDays / 365)} years ago`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search results for "{query}"
        </h1>
        <p className="text-gray-600">
          {videos.length} videos found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h3 className="font-semibold mb-4">Filters</h3>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort By Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="upload_date">Upload date</option>
                <option value="view_count">View count</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Duration Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any duration</option>
                <option value="short">Under 4 minutes</option>
                <option value="medium">4-20 minutes</option>
                <option value="long">Over 20 minutes</option>
              </select>
            </div>

            {/* Upload Date Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload date
              </label>
              <select
                value={filters.uploadDate}
                onChange={(e) => handleFilterChange('uploadDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any time</option>
                <option value="hour">Last hour</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setFilters({
                  category: '',
                  sortBy: 'relevance',
                  duration: '',
                  uploadDate: ''
                });
                setCurrentPage(0);
              }}
              className="w-full text-blue-500 hover:text-blue-700 text-sm"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No videos found</h3>
              <p className="text-gray-600">Try different keywords or remove some filters</p>
            </div>
          ) : (
            <>
              {/* Videos Grid */}
              <div className="space-y-4">
                {videos.map(video => (
                  <div
                    key={video.id}
                    className="flex bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-64 h-36 flex-shrink-0">
                      <img
                        src={video.thumbnailUrl || '/api/placeholder/320/180'}
                        alt={video.title}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                        {formatDuration(video.duration || 0)}
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        {formatViewCount(video.viewsCount)} views • {formatUploadDate(video.createdAt)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                        <span>{video.user?.username || 'Unknown'}</span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {video.description}
                      </p>
                      {video.category && (
                        <div className="mt-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {video.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                      if (pageNum >= totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-md ${
                            currentPage === pageNum
                              ? 'bg-blue-500 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Upload, User, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        VideoStream
      </Link>
      
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search videos..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          <Search size={20} />
        </button>
      </form>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <Link to="/live" className="btn btn-icon" title="Live Streaming">
              <Video size={24} />
            </Link>
            <Link to="/upload" className="btn btn-icon" title="Upload Video">
              <Upload size={24} />
            </Link>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
            <Link to="/profile" className="btn btn-icon" title="Profile">
              <User size={24} />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
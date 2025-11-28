// Demo video data using local assets
import ClockVideo from '../assets/Clock.mp4';
import ManvswildVideo from '../assets/Manvswild.mp4';
import RPGVideo from '../assets/RPG.mp4';
import SunriseVideo from '../assets/Sunrise.mp4';
import TimerVideo from '../assets/Timer.mp4';

export const demoVideos = [
  {
    id: 1,
    title: "Clock Animation - Time Visualization",
    description: "A beautiful clock animation showcasing time visualization techniques. Perfect for learning about animations and timing in web development.",
    videoUrl: ClockVideo,
    thumbnailUrl: "https://via.placeholder.com/320x180/1a1a1a/ffffff?text=Clock+Animation",
    duration: 120,
    viewsCount: 15432,
    likesCount: 1205,
    dislikesCount: 23,
    createdAt: "2024-12-15T10:30:00Z",
    category: "Technology",
    privacyStatus: "PUBLIC",
    user: {
      id: 1,
      username: "techcreator",
      fullName: "Tech Creator",
      subscriberCount: 125000
    }
  },
  {
    id: 2,
    title: "Man vs Wild - Survival Adventure",
    description: "Epic survival documentary showcasing incredible wilderness survival techniques and breathtaking nature scenes.",
    videoUrl: ManvswildVideo,
    thumbnailUrl: "https://via.placeholder.com/320x180/2d5a27/ffffff?text=Man+vs+Wild",
    duration: 480,
    viewsCount: 234567,
    likesCount: 18932,
    dislikesCount: 456,
    createdAt: "2024-12-14T14:20:00Z",
    category: "Entertainment",
    privacyStatus: "PUBLIC",
    user: {
      id: 2,
      username: "wildexplorer",
      fullName: "Wild Explorer",
      subscriberCount: 890000
    }
  },
  {
    id: 3,
    title: "RPG Game Trailer - Fantasy Adventure",
    description: "Exciting RPG game trailer featuring stunning graphics, epic storylines, and immersive gameplay. A must-watch for gaming enthusiasts!",
    videoUrl: RPGVideo,
    thumbnailUrl: "https://via.placeholder.com/320x180/8b5cf6/ffffff?text=RPG+Game",
    duration: 180,
    viewsCount: 567890,
    likesCount: 45632,
    dislikesCount: 234,
    createdAt: "2024-12-13T09:15:00Z",
    category: "Gaming",
    privacyStatus: "PUBLIC",
    user: {
      id: 3,
      username: "gamingstudio",
      fullName: "Gaming Studio Pro",
      subscriberCount: 2100000
    }
  },
  {
    id: 4,
    title: "Beautiful Sunrise Timelapse",
    description: "Stunning sunrise timelapse capturing the beauty of dawn breaking over the horizon. Peaceful and inspiring nature footage.",
    videoUrl: SunriseVideo,
    thumbnailUrl: "https://via.placeholder.com/320x180/f59e0b/ffffff?text=Sunrise+Timelapse",
    duration: 90,
    viewsCount: 98765,
    likesCount: 8901,
    dislikesCount: 12,
    createdAt: "2024-12-12T06:45:00Z",
    category: "Travel",
    privacyStatus: "PUBLIC",
    user: {
      id: 4,
      username: "naturephoto",
      fullName: "Nature Photographer",
      subscriberCount: 345000
    }
  },
  {
    id: 5,
    title: "Timer Animation - Countdown Effects",
    description: "Creative timer animation with smooth countdown effects. Great for productivity apps and time management visualizations.",
    videoUrl: TimerVideo,
    thumbnailUrl: "https://via.placeholder.com/320x180/ef4444/ffffff?text=Timer+Animation",
    duration: 60,
    viewsCount: 45678,
    likesCount: 3456,
    dislikesCount: 78,
    createdAt: "2024-12-11T16:30:00Z",
    category: "Education",
    privacyStatus: "PUBLIC",
    user: {
      id: 5,
      username: "designerdev",
      fullName: "Designer Developer",
      subscriberCount: 78000
    }
  }
];

export const getDemoVideoById = (id) => {
  return demoVideos.find(video => video.id === parseInt(id));
};

export const searchDemoVideos = (query, category = '') => {
  return demoVideos.filter(video => {
    const matchesQuery = !query || 
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = !category || video.category === category;
    
    return matchesQuery && matchesCategory;
  });
};
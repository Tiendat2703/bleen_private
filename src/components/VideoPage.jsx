import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { apiCall } from '../utils/api';
import MenuSidebar from './MenuSidebar';
import NavigationArrows from './NavigationArrows';
import logoImage from '../images/Video Page/source_2.png';

function VideoPage() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Load video from backend API
    loadVideoFromBackend();
  }, [userId, token]);

  useEffect(() => {
    // Listen for fullscreen change events
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const loadVideoFromBackend = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { response, data } = await apiCall(`/api/video/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        if (data.success && data.data) {
          setVideo({
            id: data.data.id,
            data: data.data.file_url,
            name: data.data.file_name,
            size: data.data.file_size,
            type: data.data.file_type,
            duration: data.data.duration,
            date: data.data.created_at
          });
        } else {
          setVideo(null);
        }
      } else if (response.status === 403 || response.status === 401) {
        // Token hết hạn
        console.error('Token hết hạn hoặc không có quyền truy cập');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          localStorage.clear();
          window.location.href = `/${userId}/unlock`;
        }, 2000);
      } else {
        console.error('Failed to load video:', response.statusText);
        setVideo(null);
      }
    } catch (err) {
      console.error('Error loading video:', err);
      toast.error('Lỗi khi tải video: ' + err.message);
      setVideo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };

  const handleVideoPause = () => {
    setShowPlayButton(true);
  };

  const handleVideoPlay = () => {
    setShowPlayButton(false);
  };

  const handleVideoDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Completely prevent any fullscreen behavior
    // Just do nothing on double click to avoid black screen
    return false;
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          await videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.mozRequestFullScreen) {
          await videoRef.current.mozRequestFullScreen();
        } else if (videoRef.current.msRequestFullscreen) {
          await videoRef.current.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast.error('Không thể chuyển chế độ toàn màn hình');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#F4FFF8' }}>
      <style jsx global>{`
        video::-webkit-media-controls-fullscreen-button {
          display: none !important;
        }
        video::-webkit-media-controls {
          overflow: visible !important;
        }
        video {
          -webkit-playsinline: true !important;
          -moz-playsinline: true !important;
          -ms-playsinline: true !important;
          playsinline: true !important;
        }
        video::-webkit-media-controls-panel {
          background: rgba(0,0,0,0.8) !important;
        }
        /* Style fullscreen video properly */
        video:fullscreen {
          object-fit: contain !important;
          background: black !important;
        }
        video:-webkit-full-screen {
          object-fit: contain !important;
          background: black !important;
        }
        video:-moz-full-screen {
          object-fit: contain !important;
          background: black !important;
        }
        video:-ms-fullscreen {
          object-fit: contain !important;
          background: black !important;
        }
      `}</style>
      <MenuSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header with Logo and Menu Button */}
      <div className="relative z-20 flex justify-between items-center px-4 sm:px-6 pt-2 pb-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logoImage} 
            alt="21 Bleen Studio" 
            className="w-auto object-contain"
            style={{ 
              height: '120px',
              filter: 'none',
              imageRendering: 'high-quality'
            }}
          />
        </div>
        
        {/* Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-primary-teal hover:opacity-70 transition-opacity p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Container - Reduced height to avoid browser UI */}
      <div className="absolute bg-[#d9ffe8] h-[650px] right-1/2 translate-x-1/2 rounded-tl-[196.5px] rounded-tr-[196.5px] top-[120px] w-[400px]" data-node-id="0:1223" />
      
      {/* Video player container */}
      <div className="absolute top-[182px] left-1/2 transform -translate-x-1/2 w-[320px] h-[526px] rounded-t-[160px] overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-gray-100">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-teal mb-4"></div>
                  <p className="text-primary-teal font-body text-lg">
                    Đang tải video...
                  </p>
                </div>
              ) : video ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={video.data}
                    controls
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onDoubleClick={handleVideoDoubleClick}
                    className="w-full h-full object-cover"
                    playsInline
                    webkit-playsinline="true"
                    x5-playsinline="true"
                    x5-video-player-type="h5"
                    x5-video-player-fullscreen="false"
                    x5-video-orientation="portraint"
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                  />
                  
                  {/* Custom Play Button Overlay - Reduced opacity to avoid darkening */}
                  {showPlayButton && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
                      <button
                        onClick={handlePlayClick}
                        className="w-16 h-16 bg-primary-teal rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                      >
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Video Info Badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                    </div>
                  )}

                  {/* Fullscreen Toggle Button - Always visible */}
                  <button
                    onClick={toggleFullscreen}
                    className={`absolute bottom-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all z-50 ${isFullscreen ? 'fixed top-4 right-4' : ''}`}
                    title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                    style={isFullscreen ? { position: 'fixed', top: '16px', right: '16px', zIndex: 9999 } : {}}
                  >
                    {isFullscreen ? (
                      // Exit fullscreen icon
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      // Enter fullscreen icon
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-gray-100">
                  <p className="text-primary-teal font-body text-lg mb-4">
                    Chưa có video nào
                  </p>
                  <button
                    onClick={() => window.location.href = `/${userId}/settings`}
                    className="bg-primary-teal text-white font-body px-6 py-2 rounded-full hover:bg-accent-green transition-colors"
                  >
                    Tải video lên
                  </button>
                </div>
              )}
      </div>

      {/* Navigation Arrows */}
      <NavigationArrows />
    </div>
  );
}

export default VideoPage;






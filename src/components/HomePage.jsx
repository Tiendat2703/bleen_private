import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoImage from '../images/Home Page (Initial Landing)/Logo chính.png';
import vectorIcon from '../images/Home Page (Initial Landing)/Vector.svg';

function HomePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleFingerprintClick = () => {
    // Navigate to unlock page when fingerprint is clicked
    navigate(`/${userId}/unlock`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F4FFF8' }}>
      {/* Logo chính - Fixed position */}
      <div 
        style={{ 
          position: 'absolute',
          top: '147px',
          left: '14px',
          width: '364px',
          height: '364px'
        }}
      >
        <img 
          src={logoImage} 
          alt="21 Bleen Studio" 
          className="w-full h-full object-contain"
          style={{ 
            filter: 'none',
            imageRendering: 'high-quality'
          }}
        />
      </div>

      {/* Fingerprint Icon - Centered - 2.5x size and moved down 30px */}
      <button 
        onClick={handleFingerprintClick}
        className="hover:scale-105 transition-transform cursor-pointer"
        style={{ transform: 'translateY(30px)' }}
      >
        <img 
          src={vectorIcon} 
          alt="Fingerprint" 
          className="w-30 h-30" // 12px * 2.5 = 30px
        />
      </button>
    </div>
  );
}

export default HomePage;



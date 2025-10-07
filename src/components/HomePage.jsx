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
    <div className="min-h-screen relative" style={{ backgroundColor: '#F4FFF8' }}>
      {/* Logo chính - Fixed position */}
      <div 
        className="absolute"
        style={{
          width: '364px',
          height: '364px',
          top: '147px',
          left: '14px'
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

      {/* Fingerprint Icon - Fixed position */}
      <button 
        onClick={handleFingerprintClick}
        className="absolute hover:scale-105 transition-transform cursor-pointer"
        style={{
          width: '56px',
          height: '62px',
          top: '679px',
          left: '169px'
        }}
      >
        <img 
          src={vectorIcon} 
          alt="Fingerprint" 
          className="w-full h-full object-contain"
        />
      </button>
    </div>
  );
}

export default HomePage;



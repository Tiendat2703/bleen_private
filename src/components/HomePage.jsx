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
      {/* Logo chính - Centered - 2x size */}
      <div className="mb-20">
        <img 
          src={logoImage} 
          alt="21 Bleen Studio" 
          className="w-auto object-contain"
          style={{ 
            height: '400px', // 200px * 2 = 400px
            filter: 'none',
            imageRendering: 'high-quality'
          }}
        />
      </div>

      {/* Fingerprint Icon - Centered - 0.75x size */}
      <button 
        onClick={handleFingerprintClick}
        className="hover:scale-105 transition-transform cursor-pointer"
      >
        <img 
          src={vectorIcon} 
          alt="Fingerprint" 
          className="w-9 h-9" // 12px * 0.75 = 9px
        />
      </button>
    </div>
  );
}

export default HomePage;



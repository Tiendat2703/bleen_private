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
      {/* Logo chính - Centered */}
      <div className="mb-20" style={{ transform: 'translateY(-100px)' }}>
        <img 
          src={logoImage} 
          alt="21 Bleen Studio" 
          className="w-auto object-contain"
          style={{ 
            height: '100px',
            filter: 'none',
            imageRendering: 'high-quality'
          }}
        />
      </div>

      {/* Fingerprint Icon - Centered */}
      <button 
        onClick={handleFingerprintClick}
        className="hover:scale-105 transition-transform cursor-pointer"
        style={{ transform: 'translateY(30px)' }}
      >
        <img 
          src={vectorIcon} 
          alt="Fingerprint" 
          className="w-30 h-30"
        />
      </button>
    </div>
  );
}

export default HomePage;



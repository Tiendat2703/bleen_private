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
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#F4FFF8' }}>
      {/* Logo chính - Responsive */}
      <div className="mb-16 sm:mb-20 md:mb-24">
        <img 
          src={logoImage} 
          alt="21 Bleen Studio" 
          className="w-auto object-contain"
          style={{ 
            height: '200px',
            filter: 'none',
            imageRendering: 'high-quality'
          }}
        />
      </div>

      {/* Fingerprint Icon - Responsive */}
      <button 
        onClick={handleFingerprintClick}
        className="hover:scale-105 transition-transform cursor-pointer"
      >
        <img 
          src={vectorIcon} 
          alt="Fingerprint" 
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
        />
      </button>
    </div>
  );
}

export default HomePage;



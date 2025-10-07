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
      {/* Logo */}
      <div className="mb-12">
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

      {/* Fingerprint Section */}
      <div className="flex flex-col items-center">
        <div className="relative mb-8">
          {/* Fingerprint Icon - Clickable */}
          <button 
            onClick={handleFingerprintClick}
            className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 hover:scale-105 transition-transform cursor-pointer"
          >
            <img 
              src={vectorIcon} 
              alt="Fingerprint" 
              className="w-16 h-16"
            />
          </button>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-teal mb-2">
            Nhấn vào vân tay để tiếp tục
          </h2>
          <p className="text-gray-600">
            Chạm vào biểu tượng vân tay để mở khóa
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;



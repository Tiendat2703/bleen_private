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
      {/* Logo */}
      <div className="mb-16">
        <img 
          src={logoImage} 
          alt="21 Bleen Studio" 
          className="w-auto object-contain"
          style={{ 
            height: '180px',
            filter: 'none',
            imageRendering: 'high-quality'
          }}
        />
      </div>

      {/* Fingerprint Section */}
      <div className="flex flex-col items-center">
        {/* Fingerprint Icon - Clickable */}
        <button 
          onClick={handleFingerprintClick}
          className="w-40 h-40 bg-white rounded-full shadow-2xl flex items-center justify-center mb-8 hover:scale-110 transition-all duration-300 cursor-pointer border-4 border-gray-100"
        >
          <img 
            src={vectorIcon} 
            alt="Fingerprint" 
            className="w-20 h-20"
          />
        </button>

        {/* Status Text */}
        <div className="text-center max-w-sm">
          <h2 className="text-3xl font-bold text-primary-teal mb-4">
            Chạm để mở khóa
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Đặt ngón tay lên cảm biến vân tay để tiếp tục
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-8 w-8 h-8 opacity-20">
        <div className="w-full h-full bg-primary-teal rounded-full"></div>
      </div>
      <div className="absolute top-32 right-12 w-6 h-6 opacity-30">
        <div className="w-full h-full bg-primary-teal rounded-full"></div>
      </div>
      <div className="absolute bottom-32 left-16 w-4 h-4 opacity-25">
        <div className="w-full h-full bg-primary-teal rounded-full"></div>
      </div>
      <div className="absolute bottom-20 right-8 w-10 h-10 opacity-15">
        <div className="w-full h-full bg-primary-teal rounded-full"></div>
      </div>
    </div>
  );
}

export default HomePage;



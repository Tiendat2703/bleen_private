import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoImage from '../images/Home Page (Initial Landing)/Logo chính.png';
import vectorIcon from '../images/Home Page (Initial Landing)/Vector.svg';

function HomePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isFingerprintComplete, setIsFingerprintComplete] = useState(false);

  // Simulate fingerprint scanning
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFingerprintComplete(true);
    }, 2000); // 2 seconds for fingerprint scan

    return () => clearTimeout(timer);
  }, []);

  const handleFingerprintComplete = () => {
    // Navigate to unlock page after fingerprint
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
          {/* Fingerprint Icon */}
          <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
            <img 
              src={vectorIcon} 
              alt="Fingerprint" 
              className="w-16 h-16"
            />
          </div>
          
          {/* Scanning Animation */}
          {!isFingerprintComplete && (
            <div className="absolute inset-0 w-32 h-32 border-4 border-primary-teal border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center">
          {!isFingerprintComplete ? (
            <>
              <h2 className="text-2xl font-bold text-primary-teal mb-2">
                Đang quét vân tay...
              </h2>
              <p className="text-gray-600">
                Vui lòng đặt ngón tay lên cảm biến
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Vân tay đã được xác thực!
              </h2>
              <p className="text-gray-600 mb-4">
                Bây giờ hãy nhập mã PIN để tiếp tục
              </p>
              <button
                onClick={handleFingerprintComplete}
                className="bg-primary-teal text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-600 transition-colors"
              >
                Tiếp tục
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;



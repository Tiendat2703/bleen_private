import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { apiCall } from '../../utils/api';
import uploadIcon from '../../images/Setting Page/Untitled_icon/icon-park_upload-picture.svg';

function ImageUploadSection() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Store File objects
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load existing images from backend
    loadExistingImages();
  }, []);

  const loadExistingImages = async () => {
    try {
      const response = await fetch(`/api/images/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Map backend images to display format
          const mappedImages = data.data.map(img => ({
            id: img.id,
            data: img.file_url,
            name: img.file_name,
            size: img.file_size,
            position: img.position,
            date: img.created_at
          }));
          setImages(mappedImages);
        }
      }
    } catch (err) {
      console.error('Error loading images:', err);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Check total count - max 9 images (positions 1-9)
    if (images.length + files.length > 9) {
      setError('Đã đạt giới hạn 9 ảnh (position 1-9)');
      return;
    }

    // Validate all files first
    const validFiles = [];
    for (const file of files) {
      // Check file size (5MB max for backend)
      if (file.size > 5 * 1024 * 1024) {
        setError(`Ảnh ${file.name} quá lớn (> 5MB)`);
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setError(`Ảnh ${file.name} không đúng định dạng`);
        return;
      }

      validFiles.push(file);
    }

    // Store file objects for later upload
    setImageFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            data: reader.result,
            name: file.name,
            size: file.size,
            date: new Date().toISOString(),
            position: null, // Will be assigned during upload
            isNew: true // Mark as new upload
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = async (index) => {
    const imageToDelete = images[index];
    
    // If image has ID, delete from backend
    if (imageToDelete.id) {
      try {
        const response = await fetch(`/api/images/${imageToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('Xóa ảnh thành công');
        }
      } catch (err) {
        console.error('Error deleting image:', err);
        toast.error('Lỗi khi xóa ảnh');
        return;
      }
    }
    
    // Remove from local state
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (imageFiles.length === 0) {
      setError('Vui lòng chọn ảnh để upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      // Get existing positions to find available positions
      const existingPositions = images
        .filter(img => img.position !== null && !img.isNew)
        .map(img => img.position);
      
      // Find available positions (1-9)
      const availablePositions = [];
      for (let i = 1; i <= 9; i++) {
        if (!existingPositions.includes(i)) {
          availablePositions.push(i);
        }
      }

      if (imageFiles.length > availablePositions.length) {
        setError(`Chỉ còn ${availablePositions.length} vị trí trống (từ position 1-9)`);
        setIsUploading(false);
        return;
      }

      // Upload multiple images with positions
      const formData = new FormData();
      imageFiles.forEach((file, index) => {
        formData.append('images', file);
      });
      formData.append('userId', userId);
      formData.append('positions', JSON.stringify(availablePositions.slice(0, imageFiles.length)));

      const { response, data } = await apiCall('/api/upload/multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok && data.success) {
        toast.success(`Upload thành công ${data.data.successful.length}/${data.data.total} ảnh`);
        setSuccess(`Đã lưu ${data.data.successful.length} ảnh thành công`);
        
        // Clear local state
        setImageFiles([]);
        
        // Reload images from backend
        await loadExistingImages();
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.message || 'Upload thất bại');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Lỗi khi upload ảnh');
      toast.error('Upload thất bại: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-4">
        Tải hình ảnh của bạn
      </h2>

      {/* Upload Area */}
      <label className="block mb-4 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <div className="border-3 border-dashed border-primary-teal rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-white transition-colors">
          <img src={uploadIcon} alt="Upload" className="w-16 h-16 mb-4" />
          <p className="text-primary-teal font-body text-sm text-center">
            Chọn ảnh có kích thước nhỏ hơn 5MB, tối đa 9 ảnh (position 1-9)
          </p>
        </div>
      </label>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.data}
                alt={image.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              {/* Position badge */}
              {image.position && (
                <div className="absolute top-2 left-2 bg-primary-teal text-white text-xs font-bold px-2 py-1 rounded">
                  P{image.position}
                </div>
              )}
              {/* New badge */}
              {image.isNew && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Mới
                </div>
              )}
              {/* Delete button */}
              <button
                onClick={() => handleDelete(index)}
                disabled={isUploading}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-primary-teal font-body text-sm mb-4">
        Đã có: {images.filter(img => !img.isNew).length}/9 ảnh | Chọn mới: {imageFiles.length} ảnh
      </p>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm mb-4">{success}</p>
      )}

      <button
        onClick={handleSave}
        disabled={isUploading || imageFiles.length === 0}
        className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Đang upload...' : `Upload ${imageFiles.length} ảnh lên server`}
      </button>
    </div>
  );
}

export default ImageUploadSection;


















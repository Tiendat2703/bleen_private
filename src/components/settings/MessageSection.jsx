import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import micIcon from '../../images/Setting Page/Untitled_icon/Group.svg';
import undoIcon from '../../images/Setting Page/Untitled_icon/subway_redo-icon.svg';

function MessageSection() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Load existing data from backend
    loadPostFromBackend();
    loadVoiceFromBackend();
  }, [userId, token]);

  const loadPostFromBackend = async () => {
    if (!userId || !token) return;

    try {
      const response = await fetch(`/api/posts/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMessage(data.data.content || '');
        }
      }
    } catch (err) {
      console.error('Error loading post:', err);
    }
  };

  const loadVoiceFromBackend = async () => {
    if (!userId || !token) return;

    try {
      const response = await fetch(`/api/voice/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAudioUrl(data.data.file_url);
          setRecordingTime(data.data.duration || 0);
        }
      }
    } catch (err) {
      console.error('Error loading voice:', err);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer (max 3 minutes = 180 seconds)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 180) {
            stopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleUndo = async () => {
    if (window.confirm('Bạn có chắc muốn xóa thông điệp và voice?')) {
      setError('');
      setSuccess('');
      setIsLoading(true);
      
      try {
        // Xóa post (message)
        const postResponse = await fetch(`/api/posts/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Xóa voice
        const voiceResponse = await fetch(`/api/voice/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (postResponse.ok || voiceResponse.ok) {
          toast.success('Xóa thành công');
          setMessage('');
          setAudioBlob(null);
          setAudioUrl(null);
          setRecordingTime(0);
        }
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Lỗi khi xóa: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Validate: must have message text or audio
    if ((!message || message.trim().length === 0) && !audioBlob && !audioUrl) {
      setError('Vui lòng nhập tin nhắn hoặc ghi âm');
      return;
    }

    setIsLoading(true);

    try {
      let successCount = 0;
      let totalTasks = 0;

      // 1. Save message text if exists
      if (message && message.trim().length > 0) {
        totalTasks++;
        const response = await fetch(`/api/posts/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: message,
            type: 'text'
          })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          successCount++;
        } else {
          throw new Error(data.message || 'Lưu message thất bại');
        }
      }

      // 2. Upload voice if recorded
      if (audioBlob) {
        totalTasks++;
        const formData = new FormData();
        
        // Convert webm to a file with proper extension
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { 
          type: 'audio/webm' 
        });
        
        formData.append('voice', audioFile);
        formData.append('userId', userId);
        formData.append('duration', recordingTime.toString());

        const voiceResponse = await fetch('/api/upload/voice', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const voiceData = await voiceResponse.json();
        if (voiceResponse.ok && voiceData.success) {
          successCount++;
          setAudioUrl(voiceData.data.url);
        } else {
          throw new Error(voiceData.message || 'Upload voice thất bại');
        }
      }

      if (successCount > 0) {
        toast.success(`Lưu thành công ${successCount}/${totalTasks} phần`);
        setSuccess('Đã lưu thông điệp thành công');
        
        // Clear local audio blob sau khi upload
        setAudioBlob(null);
        
        // Reload data
        await loadPostFromBackend();
        await loadVoiceFromBackend();
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Lỗi khi lưu thông điệp');
      toast.error('Lưu thất bại: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-4">
        Thông điệp được gửi gắm
      </h2>

      {/* Message Text Area */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Viết thông điệp bạn muốn gửi đi nhé..."
        maxLength={1000}
        className="w-full bg-white rounded-lg px-4 py-3 text-primary-teal font-body focus:outline-none focus:ring-2 focus:ring-primary-teal mb-2 min-h-[120px] resize-none"
      />
      <p className="text-primary-teal text-sm mb-4 text-right">
        {message.length}/1000 ký tự
      </p>

      {/* Audio Recording Controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleRecordClick}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
            isRecording
              ? 'bg-red-500 text-white'
              : 'bg-white text-primary-teal hover:bg-primary-teal hover:text-white'
          }`}
        >
          <img src={micIcon} alt="Mic" className="w-6 h-6" />
          <span className="font-body">
            {isRecording ? `Dừng lại (${formatTime(recordingTime)})` : 'Ghi âm lại'}
          </span>
        </button>
        
        <button
          onClick={handleUndo}
          className="px-6 py-3 bg-white text-primary-teal rounded-lg hover:bg-primary-teal hover:text-white transition-colors flex items-center gap-2"
        >
          <img src={undoIcon} alt="Undo" className="w-6 h-6" />
          <span className="font-body">Hoàn tác</span>
        </button>
      </div>

      {/* Audio Playback */}
      {audioUrl && !isRecording && (
        <div className="mb-4">
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm mb-4">{success}</p>
      )}

      <button
        onClick={handleSave}
        disabled={isRecording || isLoading}
        className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang lưu...' : 'Lưu thông điệp'}
      </button>
    </div>
  );
}

export default MessageSection;


















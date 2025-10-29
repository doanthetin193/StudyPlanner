import { useNotification } from '../../context/NotificationContext';
import { FaBell, FaBellSlash, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

export default function NotificationPermission() {
  const { permission, isSupported, requestPermission } = useNotification();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('notification-banner-dismissed') === 'true';
  });

  // Don't show if not supported
  if (!isSupported) {
    return null;
  }

  // Don't show if already granted or dismissed
  if (permission === 'granted' || isDismissed) {
    return null;
  }

  // Don't show if permanently denied
  if (permission === 'denied') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex items-start">
          <FaBellSlash className="text-yellow-400 mt-1 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-700">
              <strong>Thông báo bị chặn:</strong> Bạn đã từ chối quyền thông báo. 
              Để bật lại, vui lòng vào cài đặt trình duyệt và cho phép thông báo từ trang web này.
            </p>
          </div>
          <button
            onClick={() => {
              setIsDismissed(true);
              localStorage.setItem('notification-banner-dismissed', 'true');
            }}
            className="text-yellow-700 hover:text-yellow-900"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    );
  }

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setIsDismissed(true);
      localStorage.setItem('notification-banner-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div className="flex items-start">
        <FaBell className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">
            Bật thông báo nhắc nhở
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Nhận thông báo khi các công việc sắp đến hạn để không bỏ lỡ deadline!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleRequestPermission}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Bật thông báo
            </button>
            <button
              onClick={handleDismiss}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Để sau
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-700 hover:text-blue-900"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

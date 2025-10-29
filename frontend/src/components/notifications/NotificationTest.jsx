import { useNotification } from '../../context/NotificationContext';
import { FaBell } from 'react-icons/fa';

export default function NotificationTest() {
  const { showNotification, isEnabled } = useNotification();

  const handleTestNotification = () => {
    showNotification('🧪 Test Notification', {
      body: 'Đây là thông báo thử nghiệm! Notification đang hoạt động tốt.',
      requireInteraction: false,
      vibrate: [200, 100, 200]
    });
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <button
      onClick={handleTestNotification}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
      title="Test notification"
    >
      <FaBell size={24} />
    </button>
  );
}

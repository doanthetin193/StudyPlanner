/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    setIsSupported('Notification' in window);
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Trình duyệt không hỗ trợ thông báo');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Đã bật thông báo!');
        return true;
      } else if (result === 'denied') {
        toast.warning('Bạn đã từ chối thông báo. Vui lòng bật lại trong cài đặt trình duyệt.');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Không thể yêu cầu quyền thông báo');
      return false;
    }
  };

  const showNotification = (title, options = {}) => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return;
    }

    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      });

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const value = {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    isEnabled: permission === 'granted'
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

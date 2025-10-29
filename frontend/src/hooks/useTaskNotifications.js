import { useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';
import { taskAPI } from '../services/api';

export const useTaskNotifications = () => {
  const { isEnabled, showNotification } = useNotification();
  const notifiedTasksRef = useRef(new Set());
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const checkUpcomingTasks = async () => {
      try {
        const { data: tasks } = await taskAPI.getAll({ 
          status: 'todo,in-progress' 
        });

        const now = new Date();

        tasks.forEach(task => {
          if (!task.dueDate) return;

          const dueDate = new Date(task.dueDate);
          const minutesUntilDue = (dueDate - now) / (1000 * 60);
          const remindBefore = task.remindBefore || 60; // Default 60 minutes

          // Check if we should notify
          // Notify when time remaining <= remindBefore and > 0
          if (minutesUntilDue > 0 && minutesUntilDue <= remindBefore) {
            const taskKey = `${task._id}-${Math.floor(minutesUntilDue / 5)}`; // Group by 5-min intervals
            
            // Only notify once per 5-minute interval
            if (!notifiedTasksRef.current.has(taskKey)) {
              notifiedTasksRef.current.add(taskKey);

              const timeText = getTimeText(minutesUntilDue);
              
              showNotification('⏰ Sắp đến hạn!', {
                body: `${task.title}\nCòn ${timeText} nữa\nMôn: ${task.course?.name || 'N/A'}`,
                tag: task._id, // Prevent duplicate notifications for same task
                requireInteraction: minutesUntilDue <= 10, // Keep visible for urgent tasks
                vibrate: minutesUntilDue <= 10 ? [200, 100, 200] : undefined
              });
            }
          }

          // Notify overdue tasks (once when just overdue)
          if (minutesUntilDue < 0 && minutesUntilDue >= -5) {
            const overdueKey = `${task._id}-overdue`;
            
            if (!notifiedTasksRef.current.has(overdueKey)) {
              notifiedTasksRef.current.add(overdueKey);
              
              showNotification('🚨 Đã quá hạn!', {
                body: `${task.title}\nMôn: ${task.course?.name || 'N/A'}`,
                tag: `${task._id}-overdue`,
                requireInteraction: true,
                vibrate: [300, 100, 300, 100, 300]
              });
            }
          }
        });

        // Clean up old notifications from set (keep only last 100)
        if (notifiedTasksRef.current.size > 100) {
          const entries = Array.from(notifiedTasksRef.current);
          notifiedTasksRef.current = new Set(entries.slice(-100));
        }

      } catch (error) {
        console.error('Error checking upcoming tasks:', error);
      }
    };

    // Check immediately
    checkUpcomingTasks();

    // Then check every minute
    intervalRef.current = setInterval(checkUpcomingTasks, 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, showNotification]);
};

// Helper function to format time text
const getTimeText = (minutes) => {
  if (minutes < 1) {
    return 'dưới 1 phút';
  } else if (minutes < 60) {
    return `${Math.round(minutes)} phút`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (mins === 0) {
      return `${hours} giờ`;
    }
    return `${hours} giờ ${mins} phút`;
  }
};

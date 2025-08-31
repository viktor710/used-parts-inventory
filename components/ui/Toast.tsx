import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

/**
 * Типы для Toast уведомлений
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Интерфейс для Toast уведомления
 */
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string | undefined;
  duration?: number;
}

/**
 * Интерфейс для пропсов Toast компонента
 */
interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

/**
 * Компонент отдельного Toast уведомления
 */
export const ToastItem: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Анимация появления
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Автоматическое скрытие
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, toast.duration, onRemove]);

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colorMap = {
    success: 'bg-success/10 border-success/20 text-success',
    error: 'bg-error/10 border-error/20 text-error',
    info: 'bg-info/10 border-info/20 text-info',
    warning: 'bg-warning/10 border-warning/20 text-warning',
  };

  const Icon = iconMap[toast.type];

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-4 rounded-lg border shadow-lg transition-all duration-300 transform',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        colorMap[toast.type]
      )}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.message && (
          <p className="text-sm opacity-80 mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Интерфейс для пропсов Toast контейнера
 */
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

/**
 * Контейнер для всех Toast уведомлений
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

/**
 * Хук для управления Toast уведомлениями
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, message?: string) => {
    addToast({ type: 'success', title, message: message || undefined });
  };

  const showError = (title: string, message?: string) => {
    addToast({ type: 'error', title, message: message || undefined });
  };

  const showInfo = (title: string, message?: string) => {
    addToast({ type: 'info', title, message: message || undefined });
  };

  const showWarning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message: message || undefined });
  };

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

/**
 * Простой компонент Toast для использования в страницах
 */
interface SimpleToastProps {
  type: 'success' | 'error';
  message: string;
  show: boolean;
  onClose: () => void;
}

export const Toast: React.FC<SimpleToastProps> = ({ type, message, show, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, onClose]);

  if (!show) return null;

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
  };

  const colorMap = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const Icon = iconMap[type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={cn(
          'flex items-start space-x-3 p-4 rounded-lg border shadow-lg transition-all duration-300 transform',
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
          colorMap[type]
        )}
      >
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

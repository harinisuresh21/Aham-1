import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Trash2, X, ShoppingBag, Heart } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'success', message, title, icon, duration = 3000 }) => {
      const id = 'toast_' + Math.random().toString(36).substring(2, 9) + Date.now();
      const newToast = { id, type, message, title, icon, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  // Convenient helper functions
  const toast = {
    success: (message, title, icon) => addToast({ type: 'success', message, title, icon }),
    error: (message, title, icon) => addToast({ type: 'error', message, title, icon }),
    info: (message, title, icon) => addToast({ type: 'info', message, title, icon }),
    cart: (message, title) => addToast({ type: 'cart', message, title, icon: <ShoppingBag size={18} /> }),
    wishlist: (message, title) => addToast({ type: 'wishlist', message, title, icon: <Heart size={18} /> }),
    remove: removeToast,
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
      case 'cart':
        return {
          bg: 'bg-brand-primary text-white border-brand-accent/40',
          iconBg: 'bg-white/10 text-brand-accent',
          defaultIcon: <CheckCircle2 size={18} className="text-brand-accent" />,
        };
      case 'error':
        return {
          bg: 'bg-red-950/95 text-white border-red-500/30',
          iconBg: 'bg-red-500/20 text-red-400',
          defaultIcon: <Trash2 size={18} className="text-red-400" />,
        };
      case 'wishlist':
        return {
          bg: 'bg-brand-charcoal text-white border-red-500/30',
          iconBg: 'bg-red-500/20 text-red-400',
          defaultIcon: <Heart size={18} className="fill-red-500 text-red-500" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-brand-charcoal text-white border-brand-border',
          iconBg: 'bg-white/10 text-brand-cream-light',
          defaultIcon: <Info size={18} className="text-brand-cream" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Toast Notification Container (Bottom-Right) */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const style = getToastStyles(t.type);

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-md shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-toast ${style.bg}`}
            >
              {/* Icon */}
              <div className={`p-1.5 rounded-full flex-shrink-0 mt-0.5 ${style.iconBg}`}>
                {t.icon || style.defaultIcon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-1">
                {t.title && <p className="font-semibold text-sm leading-tight mb-0.5">{t.title}</p>}
                <p className="text-sm font-medium leading-relaxed opacity-95 break-words">{t.message}</p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0 p-1 -mr-1 -mt-1 text-white/80 hover:text-white"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

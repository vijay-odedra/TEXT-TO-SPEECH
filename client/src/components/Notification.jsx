import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const Notification = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle className="notify-icon success" size={20} />,
    warning: <AlertTriangle className="notify-icon warning" size={20} />,
    error: <XCircle className="notify-icon error" size={20} />,
    info: <Info className="notify-icon info" size={20} />
  };

  return (
    <div className={`notification-banner ${type}`} role="alert">
      <div className="notification-content">
        {icons[type] || icons.info}
        <span className="notification-text">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="notification-close-btn"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Notification;

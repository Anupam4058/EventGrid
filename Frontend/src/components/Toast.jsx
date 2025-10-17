import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <FiCheckCircle size={20} />,
        error: <FiXCircle size={20} />,
        warning: <FiAlertCircle size={20} />
    };

    const styles = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
    };

    return (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 border rounded-lg shadow-lg max-w-md animate-slide-in ${styles[type]}`}>
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <FiX size={18} />
            </button>
        </div>
    );
};

export default Toast;


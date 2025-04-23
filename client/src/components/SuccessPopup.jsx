import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const SuccessPopup = ({ show, onClose, message = 'Thanh toán thành công!' }) => {
    useEffect(() => {
        // Prevent body scrolling when popup is open
        if (show) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [show]);

    if (!show) return null;

    return createPortal(
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose?.();
                }
            }}
        >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 text-center animate-fade-in">
                <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
                <p className="text-gray-500 mb-6">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                <button
                    onClick={() => {
                        onClose?.();
                        window.location.href = '/trips?status=confirmed';
                    }}
                    className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                    Xem chuyến đi của bạn
                </button>
            </div>
        </div>,
        document.body
    );
};

export default SuccessPopup; 
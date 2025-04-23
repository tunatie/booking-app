import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Hiển thị popup thành công
        toast.custom((t) => (
            <div
                className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <CheckCircleIcon className="h-10 w-10 text-green-400" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Thanh toán thành công!
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            navigate('/trips?status=confirmed');
                        }}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Xem chuyến đi của bạn
                    </button>
                </div>
            </div>
        ), {
            duration: false, // Không tự động đóng
            position: 'top-center',
        });

        // Chuyển hướng sau 3 giây nếu người dùng không click nút đóng
        const timer = setTimeout(() => {
            navigate('/trips?status=confirmed');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );
} 
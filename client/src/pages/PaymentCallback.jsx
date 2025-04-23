import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
<<<<<<< HEAD
import { CheckCircleIcon } from '@heroicons/react/24/solid';
=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const bookingId = searchParams.get('bookingId');

    console.log('PaymentCallback - Search params:', {
      code,
      message,
      bookingId,
      allParams: Object.fromEntries(searchParams.entries())
    });

    if (code === '00' || code === '0') {
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
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Đóng
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-center',
      });
      
      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate('/trips?status=confirmed');
      }, 2000);
    } else {
      toast.error(message || 'Thanh toán thất bại', {
        position: 'top-center',
        duration: 3000
      });
      setTimeout(() => {
        navigate(`/trips?status=pending_payment`);
      }, 3000);
=======
    const resultCode = searchParams.get('resultCode');
    const message = searchParams.get('message');
    const bookingId = searchParams.get('bookingId');

    if (resultCode === '0') {
      toast.success('Thanh toán thành công!');
      navigate('/trips?status=confirmed');
    } else {
      toast.error(message || 'Thanh toán thất bại');
      navigate(`/trips?status=pending_payment`);
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
} 
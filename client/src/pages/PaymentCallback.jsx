import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const resultCode = searchParams.get('resultCode');
    const message = searchParams.get('message');
    const bookingId = searchParams.get('bookingId');

    if (resultCode === '0') {
      toast.success('Thanh toán thành công!');
      navigate('/trips?status=confirmed');
    } else {
      toast.error(message || 'Thanh toán thất bại');
      navigate(`/trips?status=pending_payment`);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
} 
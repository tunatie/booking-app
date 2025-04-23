import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

export default function AdminPayments() {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingBookings();
    }, []);

    const loadPendingBookings = async () => {
        try {
            const { data } = await axios.get('/bookings/pending-payment');
            setPendingBookings(data);
        } catch (error) {
            toast.error('Không thể tải danh sách đơn chờ thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPayment = async (bookingId, transactionId) => {
        try {
            await axios.post(`/payment/verify/${bookingId}`, {
                transactionId,
                note: 'Xác nhận thủ công bởi admin'
            });
            
            toast.success('Đã xác nhận thanh toán');
            loadPendingBookings();
        } catch (error) {
            toast.error('Không thể xác nhận thanh toán');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý thanh toán</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã đặt phòng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số tiền
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày đặt
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {booking._id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{booking.user?.name}</div>
                                        <div className="text-xs text-gray-400">{booking.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${booking.price?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                const transactionId = prompt('Nhập mã giao dịch:');
                                                if (transactionId) {
                                                    handleVerifyPayment(booking._id, transactionId);
                                                }
                                            }}
                                            className="text-primary hover:text-primary-dark"
                                        >
                                            Xác nhận thanh toán
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {pendingBookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không có đơn chờ thanh toán
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 
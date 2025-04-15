import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PlaceImg from '../PlaceImg';
import BookingDates from '../BookingDates';
import BookingDetailsModal from '../components/BookingDetailsModal';

export default function ReservationsPage() {
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, completed, cancelled, all, pending
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get('/bookings');
            
            if (!Array.isArray(data)) {
                console.error('Invalid response format:', data);
                setError('Định dạng dữ liệu không hợp lệ');
                return;
            }
            
            setBookings(data);
            console.log('Fetched bookings:', data);
        } catch (err) {
            console.error('Error loading bookings:', err);
            if (err.response?.status === 401) {
                setError('Vui lòng đăng nhập để xem danh sách đặt phòng');
            } else {
                setError('Không thể tải danh sách đặt phòng. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    }

    async function cancelBooking(bookingId) {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
            return;
        }
        try {
            await axios.delete(`/bookings/${bookingId}`);
            loadBookings();
        } catch (err) {
            console.error('Error cancelling booking:', err);
            alert('Có lỗi xảy ra khi hủy đặt phòng. Vui lòng thử lại sau.');
        }
    }

    async function confirmBooking(bookingId) {
        try {
            await axios.patch(`/bookings/${bookingId}`, { status: 'confirmed' });
            loadBookings();
        } catch (err) {
            console.error('Error confirming booking:', err);
            alert('Có lỗi xảy ra khi xác nhận đặt phòng. Vui lòng thử lại sau.');
        }
    }

    async function rejectBooking(bookingId) {
        try {
            await axios.patch(`/bookings/${bookingId}`, { status: 'cancelled' });
            loadBookings();
        } catch (err) {
            console.error('Error rejecting booking:', err);
            alert('Có lỗi xảy ra khi từ chối đặt phòng. Vui lòng thử lại sau.');
        }
    }

    const filteredBookings = bookings.filter(booking => {
        const now = new Date();
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);

        switch (activeTab) {
            case 'upcoming':
                return checkIn > now && booking.status === 'confirmed';
            case 'completed':
                return checkOut < now;
            case 'cancelled':
                return booking.status === 'cancelled';
            case 'pending':
                return booking.status === 'pending' || booking.status === 'requested';
            case 'all':
                return true;
            default:
                return true;
        }
    });

    console.log(`Filtering for tab: ${activeTab}`, filteredBookings);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-[1280px] mx-auto px-20">
                    <div className="py-6 flex justify-between items-center">
                        <h1 className="text-[32px] font-semibold">Đặt phòng</h1>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-[1280px] mx-auto px-20">
                    <div className="py-6 flex justify-between items-center">
                        <h1 className="text-[32px] font-semibold">Đặt phòng</h1>
                    </div>
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-red-500 mb-4">{error}</div>
                        <button 
                            onClick={loadBookings}
                            className="bg-primary text-white px-4 py-2 rounded-lg"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1280px] mx-auto px-20">
                {/* Header */}
                <div className="py-6 flex justify-between items-center">
                    <h1 className="text-[32px] font-semibold">Đặt phòng</h1>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                            </svg>
                            Lọc
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                            Xuất
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                            In
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <div className="flex gap-6">
                        <button 
                            onClick={() => setActiveTab('pending')}
                            className={`pb-4 px-2 bg-white ${activeTab === 'pending' ? 'border-b-2 border-black font-medium' : ''}`}
                        >
                            Chờ xác nhận
                        </button>
                        <button 
                            onClick={() => setActiveTab('upcoming')}
                            className={`pb-4 px-2 bg-white ${activeTab === 'upcoming' ? 'border-b-2 border-black font-medium' : ''}`}
                        >
                            Sắp tới
                        </button>
                        <button 
                            onClick={() => setActiveTab('completed')}
                            className={`pb-4 px-2 bg-white ${activeTab === 'completed' ? 'border-b-2 border-black font-medium' : ''}`}
                        >
                            Đã hoàn tất
                        </button>
                        <button 
                            onClick={() => setActiveTab('cancelled')}
                            className={`pb-4 px-2 bg-white ${activeTab === 'cancelled' ? 'border-b-2 border-black font-medium' : ''}`}
                        >
                            Đã hủy
                        </button>
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`pb-4 px-2 bg-white ${activeTab === 'all' ? 'border-b-2 border-black font-medium' : ''}`}
                        >
                            Tất cả
                        </button>
                    </div>
                </div>

                {/* Bookings List */}
                {!filteredBookings.length ? (
                    <div className="py-12 text-center">
                        <h2 className="text-lg font-medium mb-2">
                            {activeTab === 'pending' && 'Bạn không có yêu cầu đặt phòng nào đang chờ xác nhận'}
                            {activeTab === 'upcoming' && 'Bạn không có đặt phòng nào sắp tới'}
                            {activeTab === 'completed' && 'Bạn không có đặt phòng nào đã hoàn tất'}
                            {activeTab === 'cancelled' && 'Bạn không có đặt phòng nào đã hủy'}
                            {activeTab === 'all' && 'Bạn không có đặt phòng nào'}
                        </h2>
                        <p className="text-gray-500 mb-4">Kiểm tra tất cả các yêu cầu đặt phòng</p>
                        <Link to="/" className="text-black underline font-medium">
                            Tìm phòng ngay
                        </Link>
                    </div>
                ) : (
                    <div className="py-6 space-y-4">
                        {filteredBookings.map(booking => (
                            <div 
                                key={booking._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200"
                            >
                                <div className="flex gap-4 p-4">
                                    <div className="w-48 h-32 flex-shrink-0">
                                        {booking.place?.photos?.[0] && (
                                            <PlaceImg 
                                                place={booking.place} 
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-semibold mb-2">
                                            {booking.place?.title || 'Không có tiêu đề'}
                                        </h2>
                                        <BookingDates 
                                            booking={booking} 
                                            className="text-sm text-gray-500 mb-2"
                                        />
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                            <span>{booking.numberOfGuests} khách</span>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="text-lg font-semibold">
                                                ${booking.price}
                                            </div>
                                            <div className="flex gap-2">
                                                {activeTab === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedBooking(booking);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </>
                                                )}
                                                {activeTab === 'upcoming' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Help Text */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        Làm thế nào để chúng tôi có thể giúp bạn quản lý đặt phòng dễ dàng hơn?{' '}
                        <Link to="#" className="underline font-medium text-black">
                            Chia sẻ phản hồi của bạn
                        </Link>
                    </p>
                </div>

                {/* Booking Details Modal */}
                <BookingDetailsModal 
                    booking={selectedBooking}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBooking(null);
                    }}
                    onConfirm={confirmBooking}
                    onReject={rejectBooking}
                    onCancel={cancelBooking}
                />
            </div>
        </div>
    );
} 
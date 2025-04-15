import AccountNav from "../AccountNav";
import axios from "axios";
import { useState, useEffect } from "react";
import PlaceImg from "../PlaceImg";
import BookingDates from "../BookingDates";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get('/bookings');
            
            // Kiểm tra dữ liệu trả về
            if (!Array.isArray(data)) {
                console.error('Invalid response format:', data);
                setError('Định dạng dữ liệu không hợp lệ');
                return;
            }
            
            setBookings(data);
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
            loadBookings(); // Reload bookings after cancellation
        } catch (err) {
            console.error('Error cancelling booking:', err);
            alert('Có lỗi xảy ra khi hủy đặt phòng. Vui lòng thử lại sau.');
        }
    }

    if (loading) {
        return (
            <div>
                <AccountNav />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <AccountNav />
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
        );
    }

    return (
        <div>
            <AccountNav />
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-6">Đặt phòng của tôi</h1>
                
                {!bookings?.length ? (
                    <div className="text-center p-8">
                        <p className="text-gray-500 mb-4">Bạn chưa có đặt phòng nào.</p>
                        <Link 
                            to="/"
                            className="bg-primary text-white px-4 py-2 rounded-lg inline-block"
                        >
                            Tìm phòng ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(booking => (
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
                                            <Link 
                                                to={`/account/bookings/${booking._id}`}
                                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


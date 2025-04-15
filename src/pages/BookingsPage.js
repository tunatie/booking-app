import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        axios.get('/host-bookings').then(({ data }) => {
            setBookings(data);
        });
    }, []);

    const filteredBookings = bookings.filter(booking => booking.status === activeTab);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await axios.put(`/bookings/${bookingId}/status`, { status: newStatus });
            setBookings(bookings.map(booking => 
                booking._id === bookingId ? { ...booking, status: newStatus } : booking
            ));
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 rounded-full ${
                        activeTab === 'pending' ? 'bg-primary text-white' : 'bg-gray-200'
                    }`}
                >
                    Chờ xác nhận
                </button>
                <button
                    onClick={() => setActiveTab('confirmed')}
                    className={`px-4 py-2 rounded-full ${
                        activeTab === 'confirmed' ? 'bg-primary text-white' : 'bg-gray-200'
                    }`}
                >
                    Đã xác nhận
                </button>
                <button
                    onClick={() => setActiveTab('cancelled')}
                    className={`px-4 py-2 rounded-full ${
                        activeTab === 'cancelled' ? 'bg-primary text-white' : 'bg-gray-200'
                    }`}
                >
                    Đã hủy
                </button>
            </div>

            <div className="space-y-4">
                {filteredBookings.map(booking => (
                    <div key={booking._id} className="bg-gray-100 p-4 rounded-2xl">
                        <div className="flex gap-4">
                            <div className="w-32 h-32 bg-gray-300">
                                {booking.place.photos?.[0] && (
                                    <img
                                        className="object-cover w-full h-full"
                                        src={'http://localhost:4000/uploads/' + booking.place.photos[0]}
                                        alt=""
                                    />
                                )}
                            </div>
                            <div className="grow">
                                <h2 className="text-xl">{booking.place.title}</h2>
                                <div className="text-gray-500">
                                    <div>Khách: {booking.user.name}</div>
                                    <div>Ngày đặt: {new Date(booking.checkIn).toLocaleDateString()}</div>
                                    <div>Ngày trả: {new Date(booking.checkOut).toLocaleDateString()}</div>
                                    <div>Tổng tiền: {booking.price} VNĐ</div>
                                </div>
                                {activeTab === 'pending' && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                            className="bg-green-500 text-white px-4 py-2 rounded-full"
                                        >
                                            Xác nhận
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                            className="bg-red-500 text-white px-4 py-2 rounded-full"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
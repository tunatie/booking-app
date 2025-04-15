import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "./AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BookingPage() {
    const {id} = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadBooking();
    }, [id]);

    async function loadBooking() {
        try {
            setLoading(true);
            const {data} = await axios.get(`/bookings/${id}`);
            setBooking(data);
            setError(null);
        } catch (err) {
            console.error('Error loading booking:', err);
            setError('Không thể tải thông tin đặt phòng');
        } finally {
            setLoading(false);
        }
    }

    async function handleCancelBooking() {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
            return;
        }

        try {
            await axios.delete(`/bookings/${id}`);
            alert('Đã hủy đặt phòng thành công');
            navigate('/account/bookings');
        } catch (err) {
            alert('Không thể hủy đặt phòng. Vui lòng thử lại sau.');
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'confirmed':
                return 'Đã xác nhận';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <div className="text-center">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button 
                        onClick={loadBooking}
                        className="bg-primary text-white px-4 py-2 rounded-lg"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <div className="text-center">
                    <div className="text-gray-500 mb-4">Không tìm thấy thông tin đặt phòng</div>
                    <Link 
                        to="/account/bookings"
                        className="bg-primary text-white px-4 py-2 rounded-lg inline-block"
                    >
                        Quay lại danh sách đặt phòng
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto my-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">{booking.place.title}</h1>
                <Link 
                    to="/account/bookings"
                    className="text-primary hover:underline"
                >
                    &larr; Quay lại danh sách
                </Link>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6 mb-6 rounded-2xl">
                <h2 className="text-2xl font-semibold mb-4">Thông tin đặt phòng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-4">
                            <h3 className="text-gray-500 mb-2">Địa chỉ</h3>
                            <AddressLink className="block">{booking.place.address}</AddressLink>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-gray-500 mb-2">Thời gian</h3>
                            <BookingDates booking={booking} className="text-lg"/>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-gray-500 mb-2">Số khách</h3>
                            <p className="text-lg">{booking.numberOfGuests} khách</p>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-gray-500 mb-2">Thông tin thanh toán</h3>
                                <div className="text-2xl font-semibold">${booking.price}</div>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-gray-500 mb-2">Ngày đặt</h3>
                                <div>{format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</div>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-gray-500 mb-2">Trạng thái</h3>
                                <div className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                                    {getStatusText(booking.status)}
                                </div>
                            </div>
                            {booking.status !== 'cancelled' && (
                                <button
                                    onClick={handleCancelBooking}
                                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                >
                                    Hủy đặt phòng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden">
                <h2 className="text-2xl font-semibold p-6">Hình ảnh phòng</h2>
                <PlaceGallery place={booking.place}/>
            </div>
        </div>
    );
}

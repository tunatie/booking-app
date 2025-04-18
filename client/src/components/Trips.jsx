import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import UserBookingDetailsModal from './UserBookingDetailsModal';
import { vi } from 'date-fns/locale';
import { API_BASE_URL } from '../config';
import { useUser } from '../UserContext';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending_host');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    loadTrips();
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'awaiting_payment':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'awaiting_payment':
        return 'Chờ thanh toán';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setError('Vui lòng đăng nhập để xem đặt phòng');
        window.location.href = '/login';
        return;
      }

      // Map UI status to API status
      const statusMap = {
        'pending_host': 'pending',
        'pending_payment': 'awaiting_payment',
        'confirmed': 'confirmed',
        'completed': 'completed',
        'cancelled': 'cancelled'
      };

      const apiStatus = statusMap[activeTab] || 'pending';
      console.log('Fetching bookings with status:', apiStatus);
      
      // Make sure we're using the correct API endpoint format
      const response = await axios.get(`/bookings/user/${user._id}`, {
        params: {
          status: apiStatus
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      console.log('Received bookings:', response.data);
      setTrips(response.data);
    } catch (err) {
      console.error('Error loading trips:', err);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
      } else if (err.response?.status === 403) {
        setError('Bạn không có quyền xem đặt phòng này');
      } else if (err.response?.status === 404) {
        setTrips([]); // Set empty array for no bookings found
      } else {
        setError('Không thể tải danh sách đặt phòng. Vui lòng thử lại sau.');
      }
    } finally {
    setLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      trip.place?.title?.toLowerCase().includes(searchLower) ||
      trip.place?.location?.toLowerCase().includes(searchLower) ||
      trip._id?.toLowerCase().includes(searchLower) ||
      new Date(trip.checkIn).toLocaleDateString('vi-VN').includes(searchLower) ||
      new Date(trip.checkOut).toLocaleDateString('vi-VN').includes(searchLower) ||
      getStatusText(trip.status).toLowerCase().includes(searchLower)
    );
  });

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
        <div className="text-red-500 mb-4 text-center max-w-md">
          <div className="font-medium mb-2">Lỗi</div>
          <div>{error}</div>
        </div>
        {!error.includes('đăng nhập') && (
          <button 
            onClick={loadTrips}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="text-2xl font-semibold py-6">Chuyến đi của bạn</h1>

      {/* Tabs */}
          <div className="flex gap-8 -mb-px overflow-x-auto scrollbar-hide">
            <button
              className={`py-4 px-6 whitespace-nowrap transition-all ${
                activeTab === 'pending_host'
                  ? 'border-b-2 border-black text-black font-medium'
                  : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-200'
              } bg-white relative`}
              onClick={() => setActiveTab('pending_host')}
            >
              Chờ xác nhận
              {trips.filter(t => t.status === 'pending_host').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {trips.filter(t => t.status === 'pending_host').length}
                </span>
              )}
            </button>
            <button
              className={`py-4 px-6 whitespace-nowrap transition-all ${
                activeTab === 'pending_payment'
                  ? 'border-b-2 border-black text-black font-medium'
                  : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-200'
              } bg-white`}
              onClick={() => setActiveTab('pending_payment')}
            >
              Chờ thanh toán
            </button>
        <button
              className={`py-4 px-6 whitespace-nowrap transition-all ${
                activeTab === 'confirmed'
                  ? 'border-b-2 border-black text-black font-medium'
                  : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-200'
              } bg-white`}
              onClick={() => setActiveTab('confirmed')}
            >
              Đã xác nhận
        </button>
        <button
              className={`py-4 px-6 whitespace-nowrap transition-all ${
                activeTab === 'completed'
                  ? 'border-b-2 border-black text-black font-medium'
                  : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-200'
              } bg-white`}
              onClick={() => setActiveTab('completed')}
            >
              Đã hoàn thành
        </button>
        <button
              className={`py-4 px-6 whitespace-nowrap transition-all ${
                activeTab === 'cancelled'
                  ? 'border-b-2 border-black text-black font-medium'
                  : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-200'
              } bg-white`}
              onClick={() => setActiveTab('cancelled')}
        >
          Đã hủy
        </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">Chưa có chuyến đi nào</h2>
            <p className="text-gray-500 mb-6">Hãy bắt đầu tìm kiếm và đặt phòng ngay!</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              Bắt đầu tìm kiếm
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={booking.place?.photos?.[0] ? `${API_BASE_URL}/uploads/${booking.place.photos[0]}` : '/placeholder.jpg'}
                    alt={booking.place?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                    {new Date(booking.checkIn).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit'
                    })} - {new Date(booking.checkOut).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </div>
                </div>
              <div className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium text-lg line-clamp-1">{booking.place?.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-1">{booking.place?.location}</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-900">{booking.price?.toLocaleString('vi-VN')} VNĐ</span>
                        <span className="text-gray-500 text-sm ml-1">tổng {calculateNights(booking.checkIn, booking.checkOut)} đêm</span>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsModalOpen(true);
                      }}
                      className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Booking Details Modal */}
      <UserBookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        onUpdate={loadTrips}
      />
    </div>
  );
};

export default Trips; 
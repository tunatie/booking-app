import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import QRCode from 'qrcode.react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import SuccessPopup from './SuccessPopup';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4001');

const PaymentConfirmation = ({ booking, onPaymentSuccess, onClose }) => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('payos');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [payosData, setPayosData] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [paymentWindow, setPaymentWindow] = useState(null);

    // Log để debug
    useEffect(() => {
        console.log('PaymentConfirmation - Booking:', booking);
    }, [booking]);

    const handlePaymentSuccess = (data) => {
        console.log('Handling payment success with data:', data);
        
        // Đóng cửa sổ thanh toán PayOS nếu còn mở
        if (paymentWindow && !paymentWindow.closed) {
            paymentWindow.close();
        }

        // Gọi callback onPaymentSuccess ngay lập tức
        onPaymentSuccess?.();

        // Hiển thị popup thành công của chúng ta
        console.log('Showing our custom success popup');
        setShowSuccessPopup(true);
    };

    // Kết nối Socket.IO và lắng nghe sự kiện thanh toán
    useEffect(() => {
        if (booking?._id) {
            console.log('Joining booking room:', booking._id);
            
            // Tham gia vào room của booking này
            socket.emit('join_booking_room', booking._id);

            // Lắng nghe sự kiện thanh toán thành công
            const handleSuccess = (data) => {
                console.log('Received payment_success event:', data);
                if (data.bookingId === booking._id) {
                    handlePaymentSuccess(data);
                }
            };

            socket.on('payment_success', handleSuccess);

            // Cleanup function
            return () => {
                console.log('Cleaning up socket connection');
                socket.off('payment_success', handleSuccess);
            };
        }
    }, [booking?._id]);

    // Xử lý đóng popup của chúng ta
    const handleClosePopup = () => {
        console.log('Closing our custom success popup');
        setShowSuccessPopup(false);
        onClose?.();
        navigate('/trips');
    };

    // Tự động đóng popup của chúng ta sau 15 giây
    useEffect(() => {
        let timer;
        if (showSuccessPopup) {
            console.log('Setting auto-close timer for our custom popup');
            timer = setTimeout(() => {
                console.log('Auto-closing our custom popup after 15 seconds');
                handleClosePopup();
            }, 15000);
        }
        return () => {
            if (timer) {
                console.log('Clearing auto-close timer for our custom popup');
                clearTimeout(timer);
            }
        };
    }, [showSuccessPopup]);

    const handlePayOS = async () => {
        try {
            setLoading(true);
            setError(null);

            // Tính tổng tiền từ booking
            const amount = booking.price || booking.totalPrice || booking.place?.price;
            if (!amount) {
                throw new Error('Không tìm thấy thông tin giá tiền');
            }

            // Log trước khi gửi request
            console.log('PaymentConfirmation - Request data:', {
                bookingId: booking._id,
                amount,
                description: `Book-${booking._id.slice(-6)}`
            });

            const response = await axios.post('/payment/create', {
                bookingId: booking._id,
                amount,
                description: `Book-${booking._id.slice(-6)}`
            });

            console.log('PayOS Response:', response.data);

            if (response.data?.success) {
                setPayosData({
                    paymentUrl: response.data.paymentUrl,
                    accountInfo: response.data.accountInfo,
                    qrCode: response.data.qrCode
                });
            } else {
                throw new Error(response.data?.message || 'Không nhận được thông tin thanh toán');
            }
        } catch (err) {
            console.error('PayOS error:', err.response?.data || err);
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo link thanh toán');
        } finally {
            setLoading(false);
        }
    };

    // Tự động tạo QR PayOS khi chọn phương thức PayOS
    useEffect(() => {
        if (paymentMethod === 'payos' && !payosData) {
            handlePayOS();
        }
    }, [paymentMethod]);

    const handleSubmit = () => {
        if (paymentMethod === 'payos' && payosData?.paymentUrl) {
            console.log('Opening PayOS payment window:', payosData.paymentUrl);
            // Đảm bảo tắt popup mặc định của PayOS
            const paymentUrl = new URL(payosData.paymentUrl);
            paymentUrl.searchParams.set('hideSuccessPopup', 'true');
            const newWindow = window.open(paymentUrl.toString(), 'PayOS Payment', 'width=1000,height=800');
            setPaymentWindow(newWindow);
        }
    };

    return (
        <>
            {console.log('Rendering with showSuccessPopup:', showSuccessPopup)}
            <SuccessPopup 
                show={showSuccessPopup}
                onClose={handleClosePopup}
                message="Thanh toán thành công! Bạn sẽ được chuyển đến trang Chuyến đi của tôi."
            />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Xác nhận thanh toán</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Thanh toán qua PayOS</h3>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : payosData ? (
                        <>
                            <div className="flex flex-col items-center space-y-4 mb-4">
                                {payosData.qrCode ? (
                                    <div className="bg-white p-4 rounded-lg shadow-sm border" style={{ width: '300px', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <QRCode 
                                            value={payosData.qrCode}
                                            size={280}
                                            level={"H"}
                                            includeMargin={true}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-200 p-4 rounded-lg flex justify-center items-center text-gray-500" style={{ width: '300px', height: '300px' }}>
                                        Không có mã QR
                                    </div>
                                )}
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-gray-500">Quét mã QR bằng ứng dụng ngân hàng để thanh toán</p>
                                    {payosData.accountInfo && (
                                        <div className="text-left bg-gray-50 p-4 rounded-lg">
                                            <p className="font-medium">{payosData.accountInfo.bankName}</p>
                                            <p>STK: {payosData.accountInfo.accountNo}</p>
                                            <p>Chủ TK: {payosData.accountInfo.accountName}</p>
                                            <p>Số tiền: {payosData.accountInfo.amount.toLocaleString('vi-VN')} VND</p>
                                            <p>Nội dung: {payosData.accountInfo.description}</p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                                >
                                    Mở link thanh toán
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default PaymentConfirmation; 
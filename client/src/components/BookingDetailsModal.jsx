import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, UserIcon, CalendarIcon, CreditCardIcon, ClockIcon } from '@heroicons/react/24/outline';
import PlaceImg from '../PlaceImg.jsx';
import BookingDateDisplay from './BookingDateDisplay';
import ConfirmationModal from './ConfirmationModal';
import RejectReasonModal from './RejectReasonModal';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import QRCode from 'qrcode.react';
import BookingDates from '../BookingDates';
import PaymentConfirmation from './PaymentConfirmation';

// Thêm thông tin ngân hàng demo
const BANK_INFO = {
  name: "TRAN TUAN KIET",
  number: "0123456789",
  bank: "MB Bank"
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => toast.success('Đã sao chép'))
    .catch(() => toast.error('Không thể sao chép'));
};

export default function BookingDetailsModal({ booking, isOpen, onClose, onConfirm, onReject, onCancel, user }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);

    if (!booking) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_host':
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'awaiting_payment':
                return 'bg-blue-100 text-blue-800';
            case 'pending_payment':
                return 'bg-blue-100 text-blue-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending_host':
            case 'pending':
                return 'Chờ xác nhận';
            case 'awaiting_payment':
                return 'Chờ thanh toán';
            case 'pending_payment':
                return 'Chờ thanh toán';
            case 'confirmed':
                return 'Đã xác nhận';
            case 'completed':
                return 'Đã hoàn tất';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    // Tính số đêm
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const handleMoMoPayment = async (bookingId) => {
        try {
            const { data } = await axios.post(`/payment/momo/${bookingId}`);
            // Redirect to MoMo payment URL
            window.location.href = data.payUrl;
        } catch (error) {
            console.error('MoMo payment error:', error);
            toast.error('Có lỗi xảy ra khi tạo thanh toán');
        }
    };

    const generateTransferContent = (bookingId) => {
        return `BOOKING${bookingId}`;
    };

    const generateQRData = (booking) => {
        return `${BANK_INFO.bank}|${BANK_INFO.name}|${BANK_INFO.number}|${booking.price}|${generateTransferContent(booking._id)}`;
    };

    const isHost = user?._id === booking.place?.owner;

    return (
        <>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={onClose}
                                        >
                                            <span className="sr-only">Đóng</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    <div className="bg-white">
                                        {/* Header */}
                                        <div className="border-b border-gray-200 px-6 py-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                                        Chi tiết đặt phòng
                                                    </Dialog.Title>
                                                    <div className="text-sm text-gray-500">
                                                        Mã đặt phòng: {booking._id}
                                                    </div>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {getStatusText(booking.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-6 py-4">
                                            {/* Room Info */}
                                            <div className="flex gap-4 pb-6 border-b">
                                                <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                                                    {booking.place?.photos?.[0] && (
                                                        <PlaceImg 
                                                            place={booking.place} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                                                        {booking.place?.title || 'Không có tiêu đề'}
                                                    </h4>
                                                    <p className="text-gray-500 text-sm mb-2">{booking.place?.address}</p>
                                                    <BookingDateDisplay 
                                                        checkIn={booking.checkIn}
                                                        checkOut={booking.checkOut}
                                                        nights={nights}
                                                    />
                                                </div>
                                            </div>

                                            {/* Guest Info */}
                                            <div className="py-6 border-b">
                                                <h4 className="text-base font-medium text-gray-900 mb-4">Thông tin khách</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="w-5 h-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium">{booking.user?.name}</p>
                                                            <p className="text-sm text-gray-500">{booking.numberOfGuests} khách</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="text-sm font-medium">{booking.user?.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                                        <p className="text-sm font-medium">{booking.user?.phone || 'Chưa cập nhật'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Ngày đặt</p>
                                                        <p className="text-sm font-medium">{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Info */}
                                            <div className="py-6">
                                                <h4 className="text-base font-medium text-gray-900 mb-4">Chi tiết thanh toán</h4>
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Giá mỗi đêm</span>
                                                            <span className="font-medium">${booking.price.toLocaleString('en-US')}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Số đêm</span>
                                                            <span className="font-medium">x {nights}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Tổng tiền phòng</span>
                                                            <span className="font-medium">${(booking.price * nights).toLocaleString('en-US')}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Phí dịch vụ</span>
                                                            <span className="font-medium">${(booking.serviceFee || 0).toLocaleString('en-US')}</span>
                                                        </div>
                                                        {booking.discount > 0 && (
                                                            <div className="flex justify-between text-sm text-green-600">
                                                                <span>Giảm giá</span>
                                                                <span>-${booking.discount.toLocaleString('en-US')}</span>
                                                            </div>
                                                        )}
                                                        <div className="pt-3 border-t flex justify-between">
                                                            <span className="font-semibold text-base">Tổng thanh toán</span>
                                                            <span className="font-semibold text-base text-primary">
                                                                ${((booking.price * nights) + (booking.serviceFee || 0) - (booking.discount || 0)).toLocaleString('en-US')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                                    {booking.status === 'awaiting_payment' && (
                                                        <div className="mt-6 space-y-4">
                                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                                <h4 className="font-medium text-blue-800">Thanh toán đặt phòng</h4>
                                                                <p className="text-sm text-blue-600 mt-1">
                                                                    Vui lòng thanh toán theo một trong các phương thức sau
                                                                </p>
                                                                <div className="mt-3 text-sm text-blue-700">
                                                                    <span className="font-medium">Số tiền cần thanh toán: </span>
                                                                    <span className="font-bold">${booking.price?.toLocaleString()}</span>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                                <h5 className="font-medium text-gray-900 mb-3">Quét mã QR để thanh toán</h5>
                                                                <div className="flex justify-center">
                                                                    <QRCode 
                                                                        value={generateQRData(booking)}
                                                                        size={200}
                                                                        level="H"
                                                                    />
                                                                </div>
                                                                <p className="text-sm text-gray-500 text-center mt-2">
                                                                    Sử dụng app ngân hàng bất kỳ để quét mã
                                                                </p>
                                                            </div>

                                                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                                                <h5 className="font-medium text-gray-900">Hoặc chuyển khoản thủ công</h5>
                                                                
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-600">Tên tài khoản:</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium">{BANK_INFO.name}</span>
                                                                        <button 
                                                                            onClick={() => copyToClipboard(BANK_INFO.name)}
                                                                            className="text-blue-600 hover:text-blue-700"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-600">Số tài khoản:</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium">{BANK_INFO.number}</span>
                                                                        <button 
                                                                            onClick={() => copyToClipboard(BANK_INFO.number)}
                                                                            className="text-blue-600 hover:text-blue-700"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-600">Ngân hàng:</span>
                                                                    <span className="font-medium">{BANK_INFO.bank}</span>
                                                                </div>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-600">Nội dung chuyển khoản:</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium">{generateTransferContent(booking._id)}</span>
                                                                        <button 
                                                                            onClick={() => copyToClipboard(generateTransferContent(booking._id))}
                                                                            className="text-blue-600 hover:text-blue-700"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-yellow-50 p-4 rounded-lg">
                                                                <p className="text-sm text-yellow-800">
                                                                    <span className="font-medium">Lưu ý:</span> Vui lòng chuyển khoản đúng số tiền và nội dung. Đơn đặt phòng sẽ được xác nhận sau khi admin kiểm tra giao dịch (trong vòng 30 phút).
                                                                </p>
                                                            </div>

                                                            <div className="mt-4">
                                                                <button
                                                                    onClick={() => window.location.reload()}
                                                                    className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                >
                                                                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                                                    </svg>
                                                                    Kiểm tra trạng thái thanh toán
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                        </div>

                                        {/* Actions */}
                                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                            {booking.status === 'pending' && booking.place?.owner === user?._id && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                                        onClick={() => setShowConfirmModal(true)}
                                                    >
                                                        Xác nhận
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                        onClick={() => setShowRejectReasonModal(true)}
                                                    >
                                                        Từ chối
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                    onClick={() => setShowCancelModal(true)}
                                                >
                                                    Hủy đặt phòng
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                onClick={onClose}
                                            >
                                                Đóng
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    onConfirm(booking._id);
                    onClose();
                }}
                title="Xác nhận đặt phòng"
                message="Bạn có chắc chắn muốn xác nhận yêu cầu đặt phòng này? Sau khi xác nhận, khách sẽ nhận được thông báo và có thể bắt đầu chuẩn bị cho chuyến đi của họ."
                confirmText="Xác nhận"
                cancelText="Hủy bỏ"
            />

            <RejectReasonModal
                isOpen={showRejectReasonModal}
                onClose={() => setShowRejectReasonModal(false)}
                onSubmit={(reason) => {
                    onReject(booking._id, reason);
                    setShowRejectReasonModal(false);
                    onClose();
                }}
            />

            <ConfirmationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => {
                    onCancel(booking._id);
                    onClose();
                }}
                title="Hủy đặt phòng"
                message="Bạn có chắc chắn muốn hủy đặt phòng này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến trải nghiệm của khách."
                confirmText="Hủy đặt phòng"
                cancelText="Giữ nguyên"
            />

            {booking.status === 'awaiting_payment' && !isHost && (
                <div className="mt-6">
                    <PaymentConfirmation 
                        booking={booking}
                        onPaymentSuccess={() => {
                            onClose();
                            // Reload bookings after payment
                            window.location.reload();
                        }}
                    />
                </div>
            )}

            {booking.status === 'payment_submitted' && isHost && (
                <div className="mt-6">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800">Khách đã gửi biên lai thanh toán</h3>
                        {booking.paymentProof && (
                            <div className="mt-2">
                                <img 
                                    src={booking.paymentProof} 
                                    alt="Biên lai thanh toán" 
                                    className="max-w-md rounded-lg"
                                />
                            </div>
                        )}
                        <button
                            onClick={async () => {
                                try {
                                    await axios.patch(`/bookings/${booking._id}/confirm-payment-received`);
                                    onClose();
                                    window.location.reload();
                                } catch (err) {
                                    alert('Có lỗi xảy ra khi xác nhận thanh toán');
                                }
                            }}
                            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
                        >
                            Xác nhận đã nhận được tiền
                        </button>
                    </div>
                </div>
            )}
        </>
    );
} 
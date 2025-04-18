import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PlaceImg from '../PlaceImg.jsx';
import BookingDateDisplay from './BookingDateDisplay';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios';
import PaymentConfirmation from './PaymentConfirmation';

export default function UserBookingDetailsModal({ booking, isOpen, onClose, onUpdate }) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!booking) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'awaiting_payment':
                return 'bg-blue-100 text-blue-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
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

    // Tính số đêm
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const handleCancelBooking = async () => {
        if (!booking || !booking._id) {
            toast.error('Không tìm thấy thông tin đặt phòng.');
            return;
        }
        if (booking.status === 'cancelled') {
            toast.error('Đặt phòng này đã được hủy.');
            return;
        }

        // Confirm before cancelling
        if (!window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này không?')) {
            return;
        }

        try {
            setIsDeleting(true);
            await axios.patch(`/bookings/${booking._id}/cancel`); 
            toast.success('Đã hủy đặt phòng thành công');
            onUpdate?.();
            onClose();
        } catch (error) {
            console.error('Error canceling booking:', error);
            let errorMessage = 'Không thể hủy đặt phòng. Vui lòng thử lại sau.';
            if (error.response?.status === 403) {
                errorMessage = 'Bạn không có quyền hủy đặt phòng này.';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data.error || 'Yêu cầu hủy không hợp lệ.';
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
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

                                        {/* Payment Info */}
                                        <div className="py-6">
                                            <h4 className="text-base font-medium text-gray-900 mb-4">Chi tiết thanh toán</h4>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Giá mỗi đêm</span>
                                                        <span className="font-medium">{booking.price?.toLocaleString('vi-VN')} VNĐ</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Số đêm</span>
                                                        <span className="font-medium">x {nights}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Tổng tiền phòng</span>
                                                        <span className="font-medium">{(booking.price * nights).toLocaleString('vi-VN')} VNĐ</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Phí dịch vụ</span>
                                                        <span className="font-medium">{(booking.serviceFee || 0).toLocaleString('vi-VN')} VNĐ</span>
                                                    </div>
                                                    <div className="pt-3 border-t flex justify-between">
                                                        <span className="font-semibold text-base">Tổng thanh toán</span>
                                                        <span className="font-semibold text-base text-primary">
                                                            {((booking.price * nights) + (booking.serviceFee || 0)).toLocaleString('vi-VN')} VNĐ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Section */}
                                        {booking.status === 'awaiting_payment' && (
                                            <PaymentConfirmation
                                                booking={booking}
                                                onPaymentSuccess={() => {
                                                    toast.success('Đã gửi xác nhận thanh toán. Vui lòng chờ admin duyệt.');
                                                    onUpdate?.();
                                                    onClose();
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                        {booking.status === 'pending' && (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={handleCancelBooking}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? 'Đang hủy...' : 'Hủy đặt phòng'}
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
    );
} 
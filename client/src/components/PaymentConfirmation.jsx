import { useState } from 'react';
import axios from '../utils/axios';

export default function PaymentConfirmation({ booking, onPaymentSuccess }) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    // Thông tin ngân hàng từ booking.owner
    const bankInfo = {
        bankName: booking?.owner?.bankName || "Ngân hàng Thương mại cổ phần Ngoại thương Việt Nam (VietComBank)",
        accountNumber: booking?.owner?.bankAccountNumber || "1014243159",
        accountName: booking?.owner?.bankAccountName || "TRAN TUAN KIET",
        bankBin: booking?.owner?.bankBin || "970436",
        branch: booking?.owner?.bankBranch || "Chi nhánh Bình Dương",
        content: `BOOKING${booking?._id?.slice(-6)}`
    };

    // Tạo URL VietQR
    const generateVietQRUrl = () => {
        const amount = booking?.totalPrice || 0;
        const encodedAccountName = encodeURIComponent(bankInfo.accountName);
        const encodedContent = encodeURIComponent(bankInfo.content);
        
        return `https://img.vietqr.io/image/${bankInfo.bankBin}-${bankInfo.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedContent}&accountName=${encodedAccountName}`;
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.includes('image')) {
            setError('Vui lòng chỉ tải lên file ảnh');
            return;
        }

        setUploading(true);
        setError(null);

        setTimeout(() => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                setUploading(false);
            };
            reader.readAsDataURL(file);
        }, 1000);
    };

    const handleSubmit = async () => {
        if (!uploadedImage) {
            setError('Vui lòng tải lên ảnh biên lai chuyển khoản');
            return;
        }

        try {
            await axios.patch(`/bookings/${booking._id}/confirm-payment`, {
                paymentProof: uploadedImage
            });
            
            if (onPaymentSuccess) {
                onPaymentSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Thanh toán đặt phòng</h2>
            
            {/* Hiển thị số tiền */}
            <div className="mb-6">
                <div className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking?.totalPrice || 0)}
                </div>
                <p className="text-gray-500">Quét mã VietQR bên dưới bằng ứng dụng Ngân hàng của bạn.</p>
            </div>

            {/* QR Code */}
            <div className="mb-6 flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg shadow-sm border mb-2">
                    <img 
                        src={generateVietQRUrl()} 
                        alt="VietQR Payment Code"
                        className="w-64 h-64 object-contain"
                    />
                </div>
                <p className="text-sm text-gray-500 text-center">
                    Sử dụng ứng dụng Ngân hàng hỗ trợ VietQR để quét mã
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                    Thông tin chuyển khoản (số tiền, nội dung...) sẽ được tự động điền
                </p>
            </div>

            {/* Upload biên lai */}
            <div className="mb-6">
                <label className="block text-gray-600 mb-2">Tải lên ảnh biên lai chuyển khoản:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                />
                {uploading && (
                    <div className="text-sm text-gray-500 mt-2">Đang tải ảnh...</div>
                )}
                {uploadedImage && (
                    <div className="mt-2">
                        <img src={uploadedImage} alt="Biên lai" className="max-w-xs rounded-lg" />
                    </div>
                )}
                {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
            </div>

            {/* Nút xác nhận */}
            <button
                onClick={handleSubmit}
                disabled={!uploadedImage || uploading}
                className={`w-full py-3 rounded-lg text-white font-medium
                    ${!uploadedImage || uploading 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-primary hover:bg-primary-dark'}`}
            >
                Xác nhận đã chuyển khoản
            </button>

            {/* Lưu ý */}
            <div className="mt-4 text-sm text-gray-500">
                <p>Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Vui lòng chuyển khoản chính xác số tiền và nội dung chuyển khoản</li>
                    <li>Đặt phòng sẽ được xác nhận sau khi chúng tôi nhận được tiền</li>
                    <li>Thời gian xác nhận: 5-10 phút trong giờ hành chính</li>
                </ul>
            </div>
        </div>
    );
} 
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const BANK_LIST = [
    { name: 'Vietcombank', bin: '970436' },
    { name: 'BIDV', bin: '970418' },
    { name: 'Techcombank', bin: '970407' },
    { name: 'MB Bank', bin: '970422' },
    { name: 'ACB', bin: '970416' },
    { name: 'Sacombank', bin: '970403' },
    { name: 'VPBank', bin: '970432' },
    { name: 'TPBank', bin: '970423' },
    // Thêm các ngân hàng khác nếu cần
];

export default function PaymentSettingsPage() {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bankName: user?.bankName || '',
        bankAccountName: user?.bankAccountName || '',
        bankAccountNumber: user?.bankAccountNumber || '',
        bankBin: user?.bankBin || '',
        bankBranch: user?.bankBranch || ''
    });

    const handleBankSelect = (selectedBank) => {
        setFormData(prev => ({
            ...prev,
            bankName: selectedBank.name,
            bankBin: selectedBank.bin
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put('/bank-info', formData);
            setUser(response.data.user);
            toast.success('Đã lưu thông tin ngân hàng', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#22c55e',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '10px',
                },
                icon: '✓',
            });
        } catch (error) {
            console.error('Error updating bank info:', error);
            toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật thông tin', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '10px',
                },
                icon: '✕',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="bg-white rounded-t-xl border border-b-0 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link to="/account-settings" className="text-gray-600 hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-semibold">Thông tin thanh toán</h1>
                    </div>
                    <p className="text-gray-600">
                        Cập nhật thông tin tài khoản ngân hàng của bạn để nhận thanh toán từ khách hàng thông qua VietQR.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-b-xl border p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Bank Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn ngân hàng
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {BANK_LIST.map((bank) => (
                                    <button
                                        key={bank.bin}
                                        type="button"
                                        onClick={() => handleBankSelect(bank)}
                                        className={`p-3 border rounded-lg text-sm text-center transition-colors ${
                                            formData.bankBin === bank.bin
                                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {bank.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Account Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên chủ tài khoản
                            </label>
                            <input
                                type="text"
                                value={formData.bankAccountName}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankAccountName: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                placeholder="VD: NGUYEN VAN A"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Nhập chính xác tên chủ tài khoản bằng chữ in hoa, không dấu
                            </p>
                        </div>

                        {/* Account Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số tài khoản
                            </label>
                            <input
                                type="text"
                                value={formData.bankAccountNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankAccountNumber: e.target.value.replace(/\D/g, '') }))}
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                placeholder="Nhập số tài khoản ngân hàng"
                            />
                        </div>

                        {/* Branch (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chi nhánh (không bắt buộc)
                            </label>
                            <input
                                type="text"
                                value={formData.bankBranch}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankBranch: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                placeholder="VD: Hồ Chí Minh"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Đang cập nhật...' : 'Lưu thông tin'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Information */}
                <div className="mt-8 bg-white rounded-xl border p-6">
                    <h2 className="text-lg font-semibold mb-4">Thông tin quan trọng</h2>
                    <div className="space-y-4 text-gray-600">
                        <p>
                            • Thông tin tài khoản ngân hàng sẽ được sử dụng để tạo mã QR khi khách hàng thanh toán đặt phòng.
                        </p>
                        <p>
                            • Đảm bảo nhập chính xác thông tin để tránh thất thoát khi nhận thanh toán.
                        </p>
                        <p>
                            • Bạn có thể cập nhật thông tin này bất cứ lúc nào.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
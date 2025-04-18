import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from '../utils/axios';
import { useProgress } from "../HostLayout";
import HeaderActions from "../components/HeaderActions";
import { getNextPage, getPreviousPage, getPageProgress } from "../utils/pageOrder";

export default function DiscountPage() {
    const { setProgress } = useProgress();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [discounts, setDiscounts] = useState({
        newListing: 20,
        weekly: 0,
        monthly: 0
    });
    const [discountEnabled, setDiscountEnabled] = useState({
        newListing: true,
        weekly: false,
        monthly: false
    });

    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                const initialDiscounts = data?.discount || { newListing: 20, weekly: 0, monthly: 0 };
                setDiscounts(initialDiscounts);
                setDiscountEnabled({
                    newListing: (initialDiscounts.newListing || 0) > 0,
                    weekly: (initialDiscounts.weekly || 0) > 0,
                    monthly: (initialDiscounts.monthly || 0) > 0
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial discounts:", err);
                setDiscounts({ newListing: 20, weekly: 0, monthly: 0 });
                setDiscountEnabled({ newListing: true, weekly: false, monthly: false });
                setLoading(false);
            });

        const progress = getPageProgress('discount');
        setProgress(progress);
    }, [setProgress]);

    useEffect(() => {
        if (!loading) {
            const handler = setTimeout(() => {
                const discountPayload = {
                    newListing: discountEnabled.newListing ? (discounts.newListing || 0) : 0,
                    weekly: discountEnabled.weekly ? (discounts.weekly || 0) : 0,
                    monthly: discountEnabled.monthly ? (discounts.monthly || 0) : 0,
                };
                axios.put('/places-form-data', { discount: discountPayload })
                    .catch(err => console.error("Error updating discounts:", err));
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [discounts, discountEnabled, loading]);

    const handleNext = () => {
        const discountPayload = {
            newListing: discountEnabled.newListing ? (discounts.newListing || 0) : 0,
            weekly: discountEnabled.weekly ? (discounts.weekly || 0) : 0,
            monthly: discountEnabled.monthly ? (discounts.monthly || 0) : 0,
        };
        axios.put('/places-form-data', { discount: discountPayload })
            .then(() => {
                const nextPage = getNextPage('discount');
                if (nextPage) {
                    navigate(`/account/hosting/${nextPage}`);
                }
            })
            .catch(err => {
                console.error("Error saving final discounts:", err);
            });
    };

    const handleBack = () => {
        const prevPage = getPreviousPage('discount');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    };

    const handleDiscountInputChange = (type, value) => {
        const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
            setDiscounts(prev => ({
                ...prev,
                [type]: numericValue
            }));
            if (numericValue > 0 && !discountEnabled[type]) {
                setDiscountEnabled(prev => ({ ...prev, [type]: true }));
            }
            if (numericValue === 0 && discountEnabled[type]) {
                 setDiscountEnabled(prev => ({ ...prev, [type]: false }));
            }
        } else if (value.replace(/[^0-9]/g, '') === '') {
            setDiscounts(prev => ({
                ...prev,
                [type]: 0
            }));
             if (discountEnabled[type]) {
                 setDiscountEnabled(prev => ({ ...prev, [type]: false }));
            }
        }
    };

    const toggleDiscountEnabled = (type) => {
        setDiscountEnabled(prev => {
            const newState = { ...prev, [type]: !prev[type] };
            if (!newState[type]) {
                setDiscounts(d => ({ ...d, [type]: 0 }));
            }
            else if (newState[type] && (discounts[type] || 0) === 0) {
                 setDiscounts(d => ({ ...d, [type]: type === 'newListing' ? 20 : 10 }));
            }
            return newState;
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderActions />
            
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl max-w-[568px] w-full mx-4">
                        <div className="p-6 relative">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute right-6 top-6 bg-transparent hover:opacity-70"
                            >
                                <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current stroke-current stroke-[3]">
                                    <path d="m6 6 20 20M26 6 6 26"></path>
                                </svg>
                            </button>
                            <h3 className="text-[22px] font-semibold mb-6">Giảm giá</h3>
                            <p className="mb-6">
                                Bạn tự quyết định mức giảm giá và có thể thay đổi bất cứ lúc nào.
                            </p>
                            <p className="mb-6">
                                Mức giảm giá được đề xuất dựa trên mức trung bình của các nhà/phòng cho thuê có ưu đãi giảm giá trong khu vực của bạn (hoặc mức trung bình trên toàn cầu nếu không có đủ nhà/phòng cho thuê có ưu đãi giảm giá trong khu vực của bạn). Ưu đãi giảm giá theo tuần dành cho những kỳ ở từ 7 đêm trở lên. Ưu đãi giảm giá theo tháng dành cho những kỳ ở từ 28 đêm trở lên.
                            </p>
                            <p>
                                Truy cập phần Giảm giá trong Trung tâm trợ giúp của chúng tôi để tìm hiểu thêm.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 pt-[48px] pb-[88px]">
                <div className="w-full max-w-[1280px] mx-auto px-20">
                    <h1 className="text-[32px] font-semibold mb-4">
                        Thêm ưu đãi giảm giá
                    </h1>
                    <p className="mb-8">
                        Giúp chỗ ở của bạn trở nên nổi bật dễ nhanh chóng được đặt phòng và thu hút những bài đánh giá đầu tiên.
                    </p>

                    <div className="space-y-4">
                        <div 
                            className={`border rounded-2xl p-6 cursor-pointer transition-all ${discountEnabled.newListing ? 'bg-[#F7F7F7] border-black' : 'bg-white border-gray-200 hover:border-black'}`}
                            onClick={() => toggleDiscountEnabled('newListing')}
                        >
                            <div className="flex items-center">
                                <div className="w-[80px]">
                                    <div className={`w-full bg-white text-[22px] font-medium rounded-[32px] border border-[#717171] text-center h-[36px] flex items-center justify-center ${discountEnabled.newListing ? 'text-black' : 'text-[#B0B0B0]'}`}>
                                        {(discounts.newListing || 0)}%
                                    </div>
                                </div>
                                <div className="flex-1 ml-4">
                                    <h2 className="text-lg font-semibold mb-1">Khuyến mãi cho nhà/phòng cho thuê mới</h2>
                                    <div className="text-[#717171]">Giảm giá {(discounts.newListing || 0)}% cho 3 lượt đặt phòng đầu tiên của bạn</div>
                                </div>
                                <div 
                                    className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${discountEnabled.newListing ? 'bg-black border-black' : 'bg-white border-gray-400'}`}
                                >
                                    {discountEnabled.newListing && (
                                        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                                            <path d="M13.102 24.965l12.432-12.432-2.203-2.203-10.229 10.229-4.327-4.327-2.203 2.203z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`border rounded-2xl p-6 cursor-pointer transition-all ${discountEnabled.weekly ? 'bg-[#F7F7F7] border-black' : 'bg-white border-gray-200 hover:border-black'}`}
                            onClick={() => toggleDiscountEnabled('weekly')}
                        >
                            <div className="flex items-center">
                                <div className="w-[80px]">
                                    <input
                                        type="text"
                                        value={(discounts.weekly || 0) + '%'}
                                        onChange={(e) => handleDiscountInputChange('weekly', e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => e.target.select()}
                                        disabled={!discountEnabled.weekly || loading}
                                        className={`w-full bg-white text-[22px] font-medium rounded-[32px] border border-[#717171] text-center h-[36px] transition-colors ${discountEnabled.weekly ? 'text-black focus:border-black focus:ring-1 focus:ring-black' : 'text-[#B0B0B0]'}`}
                                        maxLength={4}
                                    />
                                </div>
                                <div className="flex-1 ml-4">
                                    <h2 className="text-lg font-semibold mb-1">Giảm giá theo tuần</h2>
                                    <div className="text-[#717171]">Dành cho thời gian ở từ 7 đêm trở lên</div>
                                </div>
                                <div 
                                    className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${discountEnabled.weekly ? 'bg-black border-black' : 'bg-white border-gray-400'}`}
                                >
                                    {discountEnabled.weekly && (
                                        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                                            <path d="M13.102 24.965l12.432-12.432-2.203-2.203-10.229 10.229-4.327-4.327-2.203 2.203z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`border rounded-2xl p-6 cursor-pointer transition-all ${discountEnabled.monthly ? 'bg-[#F7F7F7] border-black' : 'bg-white border-gray-200 hover:border-black'}`}
                            onClick={() => toggleDiscountEnabled('monthly')}
                        >
                            <div className="flex items-center">
                                <div className="w-[80px]">
                                    <input
                                        type="text"
                                        value={(discounts.monthly || 0) + '%'}
                                        onChange={(e) => handleDiscountInputChange('monthly', e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => e.target.select()}
                                        disabled={!discountEnabled.monthly || loading}
                                        className={`w-full bg-white text-[22px] font-medium rounded-[32px] border border-[#717171] text-center h-[36px] transition-colors ${discountEnabled.monthly ? 'text-black focus:border-black focus:ring-1 focus:ring-black' : 'text-[#B0B0B0]'}`}
                                        maxLength={4}
                                    />
                                </div>
                                <div className="flex-1 ml-4">
                                    <h2 className="text-lg font-semibold mb-1">Giảm giá theo tháng</h2>
                                    <div className="text-[#717171]">Dành cho thời gian ở từ 28 đêm trở lên</div>
                                </div>
                                <div 
                                    className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${discountEnabled.monthly ? 'bg-black border-black' : 'bg-white border-gray-400'}`}
                                >
                                    {discountEnabled.monthly && (
                                        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                                            <path d="M13.102 24.965l12.432-12.432-2.203-2.203-10.229 10.229-4.327-4.327-2.203 2.203z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm text-gray-600">Mỗi kỳ ở chỉ được áp dụng một ưu đãi giảm giá duy nhất. <button onClick={() => setShowModal(true)} className="underline hover:opacity-70 bg-transparent">Tìm hiểu thêm</button></p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between">
                    <button
                        onClick={handleBack}
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-[#222222]"
                        disabled={loading}
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
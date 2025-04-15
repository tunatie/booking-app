import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useProgress } from "../HostLayout";
import HeaderActions from "../components/HeaderActions";
import { getNextPage, getPreviousPage, getPageProgress } from "../utils/pageOrder";

export default function SecurityPage() {
    const { setProgress } = useProgress();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [securityItems, setSecurityItems] = useState({
        hasCamera: false,
        hasNoiseDetector: false,
        hasWeapon: false,
    });

    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                const initialSecurity = data?.security || {};
                setSecurityItems({
                    hasCamera: initialSecurity.hasCamera || false,
                    hasNoiseDetector: initialSecurity.hasNoiseDetector || false,
                    hasWeapon: initialSecurity.hasWeapon || false,
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial security data:", err);
                setSecurityItems({ hasCamera: false, hasNoiseDetector: false, hasWeapon: false });
                setLoading(false);
            });

        const progress = getPageProgress('security');
        setProgress(progress);
    }, [setProgress]);

    useEffect(() => {
        if (!loading) {
            const handler = setTimeout(() => {
                const securityPayload = {
                    hasCamera: securityItems.hasCamera,
                    hasNoiseDetector: securityItems.hasNoiseDetector,
                    hasWeapon: securityItems.hasWeapon
                };
                axios.put('/places-form-data', { security: securityPayload })
                    .catch(err => console.error("Error updating security data:", err));
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [securityItems, loading]);

    const toggleSecurityItem = (itemKey) => {
        setSecurityItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
    };

    const handleNext = () => {
        const securityPayload = {
            hasCamera: securityItems.hasCamera,
            hasNoiseDetector: securityItems.hasNoiseDetector,
            hasWeapon: securityItems.hasWeapon
        };
        axios.put('/places-form-data', { security: securityPayload })
            .then(() => {
                const nextPage = getNextPage('security');
                if (nextPage) {
                    navigate(`/account/hosting/${nextPage}`);
                }
            })
            .catch(err => {
                console.error("Error saving final security data:", err);
            });
    };

    const handleBack = () => {
        const prevPage = getPreviousPage('security');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
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
            <div className="flex-1 pt-[48px] pb-[88px]">
                <div className="w-full max-w-[1280px] mx-auto px-20">
                    <div className="flex items-start gap-3 mb-6">
                        <h1 className="text-[32px] font-semibold">
                            Chia sẻ thông tin an toàn
                        </h1>
                        <button className="mt-3">
                            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
                                <path d="M8 1.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5zM0.25 8a7.75 7.75 0 1 1 15.5 0 7.75 7.75 0 0 1-15.5 0z"/>
                                <path d="M8 3.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM6 7.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-4z"/>
                            </svg>
                        </button>
                    </div>
                    <p className="mb-8">Chỗ ở của bạn có tiện nghi nào trong số sau đây không?</p>

                    <div className="space-y-4">
                        <div 
                            className={`border rounded-2xl p-6 cursor-pointer transition-all ${securityItems.hasCamera ? 'bg-[#F7F7F7] border-black' : 'bg-white border-gray-200 hover:border-black'}`}
                            onClick={() => toggleSecurityItem('hasCamera')}
                        >
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h2 className="text-lg font-medium">Có camera an ninh ngoài nhà</h2>
                                </div>
                                <div className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${securityItems.hasCamera ? 'bg-black border-black' : 'bg-white border-gray-400'}`}>
                                    {securityItems.hasCamera && (
                                        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                                            <path d="M13.102 24.965l12.432-12.432-2.203-2.203-10.229 10.229-4.327-4.327-2.203 2.203z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`border rounded-2xl p-6 cursor-pointer transition-all ${securityItems.hasNoiseDetector ? 'bg-[#F7F7F7] border-black' : 'bg-white border-gray-200 hover:border-black'}`}
                            onClick={() => toggleSecurityItem('hasNoiseDetector')}
                        >
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h2 className="text-lg font-medium">Có máy dò độ ồn</h2>
                                </div>
                                <div className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${securityItems.hasNoiseDetector ? 'bg-black border-black' : 'bg-white border-gray-400'}`}>
                                    {securityItems.hasNoiseDetector && (
                                        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                                            <path d="M13.102 24.965l12.432-12.432-2.203-2.203-10.229 10.229-4.327-4.327-2.203 2.203z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`border rounded-2xl p-6 cursor-pointer transition-all ${securityItems.hasWeapon ? 'bg-[#F7F7F7] border-black' : 'bg-white border-gray-200 hover:border-black'}`}
                            onClick={() => toggleSecurityItem('hasWeapon')}
                        >
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h2 className="text-lg font-medium">Vũ khí tại chỗ ở</h2>
                                </div>
                                <div className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${securityItems.hasWeapon ? 'bg-black border-black' : 'bg-white border-gray-400'}`}>
                                    {securityItems.hasWeapon && (
                                        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                                            <path d="M13.102 24.965l12.432-12.432-2.203-2.203-10.229 10.229-4.327-4.327-2.203 2.203z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Những điều quan trọng cần biết</h3>
                        <p className="mb-4 text-[#717171]">
                            Không được phép lắp đặt camera an ninh giám sát các không gian trong nhà, ngay cả khi không bật. Phải cho biết rõ về tất cả các camera an ninh ngoài nhà.
                        </p>
                        <p className="text-[#717171]">
                            Lưu ý tuân thủ luật pháp địa phương và xem lại <a href="#" className="underline hover:opacity-70">chính sách chống phân biệt</a> của TuanKiet cũng như các loại <a href="#" className="underline hover:opacity-70">phí cho Chủ nhà và khách</a>.
                        </p>
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
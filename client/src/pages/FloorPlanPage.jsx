import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../contexts/FormContext";
import HeaderActions from "../components/HeaderActions";
import axios from "../utils/axios";

export default function FloorPlanPage() {
    const navigate = useNavigate();
    const { formData, updateFormData } = useForm();
    const [loading, setLoading] = useState(true);
    const [floorPlan, setFloorPlan] = useState(formData.floorPlan || {
        guests: 1,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1
    });

    // Load existing data when component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await axios.get('/places-form-data');
                if (data && data.floorPlan) {
                    setFloorPlan(data.floorPlan);
                }
            } catch (err) {
                console.error("Error loading floor plan data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Update form context when floorPlan changes
    useEffect(() => {
        const updateForm = async () => {
            if (!loading) {
                try {
                    await axios.put('/places-form-data', { floorPlan });
                    updateFormData('floorPlan', floorPlan);
                } catch (error) {
                    console.error("Error updating floor plan:", error);
                }
            }
        };
        updateForm();
    }, [floorPlan, loading]);

    const handleCounterChange = (field, delta) => {
        setFloorPlan(prev => ({
            ...prev,
            [field]: Math.max(1, prev[field] + delta)
        }));
    };

    const handleNext = async () => {
        try {
            await axios.put('/places-form-data', { floorPlan });
            navigate('/account/hosting/amenities', { replace: true });
        } catch (error) {
            console.error("Error saving floor plan:", error);
            alert("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.");
        }
    };

    const handleBack = () => {
        navigate('/account/hosting/location', { replace: true });
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
            
            <div className="flex-1 pt-[48px] pb-[88px] flex items-center">
                <div className="max-w-[640px] mx-auto">
                    <div className="mb-6">
                        <h1 className="text-[32px] font-semibold mb-2">
                            Chia sẻ một số thông tin cơ bản về chỗ ở của bạn
                        </h1>
                        <p className="text-gray-500 text-base">
                            Sau này, bạn sẽ bổ sung những thông tin khác, như loại giường chẳng hạn.
                        </p>
                    </div>

                    {/* Counter sections */}
                    <div className="space-y-6">
                        {/* Guests */}
                        <div className="flex items-center justify-between py-6 border-b">
                            <div>
                                <h3 className="text-base font-normal">Khách</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleCounterChange('guests', -1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={floorPlan.guests <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{floorPlan.guests}</span>
                                <button
                                    onClick={() => handleCounterChange('guests', 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white"
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>+</span>
                                </button>
                            </div>
                        </div>

                        {/* Bedrooms */}
                        <div className="flex items-center justify-between py-6 border-b">
                            <div>
                                <h3 className="text-base font-normal">Phòng ngủ</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleCounterChange('bedrooms', -1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={floorPlan.bedrooms <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{floorPlan.bedrooms}</span>
                                <button
                                    onClick={() => handleCounterChange('bedrooms', 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white"
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>+</span>
                                </button>
                            </div>
                        </div>

                        {/* Beds */}
                        <div className="flex items-center justify-between py-6 border-b">
                            <div>
                                <h3 className="text-base font-normal">Giường</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleCounterChange('beds', -1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={floorPlan.beds <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{floorPlan.beds}</span>
                                <button
                                    onClick={() => handleCounterChange('beds', 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white"
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>+</span>
                                </button>
                            </div>
                        </div>

                        {/* Bathrooms */}
                        <div className="flex items-center justify-between py-6 border-b">
                            <div>
                                <h3 className="text-base font-normal">Phòng tắm</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleCounterChange('bathrooms', -1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={floorPlan.bathrooms <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{floorPlan.bathrooms}</span>
                                <button
                                    onClick={() => handleCounterChange('bathrooms', 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white"
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>+</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-screen-lg mx-auto px-20 py-4 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 rounded-lg border border-gray-200 font-medium bg-white"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-[#222222]"
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
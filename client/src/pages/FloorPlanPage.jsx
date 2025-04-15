import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useProgress } from "../HostLayout";
import HeaderActions from "../components/HeaderActions";
import { getNextPage, getPreviousPage, getPageProgress } from "../utils/pageOrder";

export default function FloorPlanPage() {
    const [guests, setGuests] = useState(1);
    const [bedrooms, setBedrooms] = useState(1);
    const [beds, setBeds] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [loading, setLoading] = useState(true);
    const { setProgress } = useProgress();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                setGuests(data?.maxGuests || 1);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial floor plan data:", err);
                setLoading(false);
            });

        const progress = getPageProgress('floor-plan');
        setProgress(progress);
    }, [setProgress]);

    async function updateFloorPlanData(field, value) {
        if (field === 'maxGuests') setGuests(value);
        if (field === 'bedrooms') setBedrooms(value);
        if (field === 'beds') setBeds(value);
        if (field === 'bathrooms') setBathrooms(value);

        try {
            let payload = {};
            if (field === 'maxGuests') payload = { maxGuests: value };

            if (field !== 'bedrooms' && field !== 'beds' && field !== 'bathrooms') {
                 await axios.put('/places-form-data', payload);
            }

        } catch (err) {
            console.error(`Error updating ${field}:`, err);
        }
    }

    const handleCounterChange = (field, delta) => {
        let newValue;
        if (field === 'maxGuests') {
            newValue = Math.max(1, guests + delta);
            updateFloorPlanData('maxGuests', newValue);
        }
        if (field === 'bedrooms') {
            newValue = Math.max(1, bedrooms + delta);
            setBedrooms(newValue);
        }
        if (field === 'beds') {
            newValue = Math.max(1, beds + delta);
            setBeds(newValue);
        }
        if (field === 'bathrooms') {
            newValue = Math.max(1, bathrooms + delta);
            setBathrooms(newValue);
        }
    };

    function handleNext() {
        const nextPage = getNextPage('floor-plan');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    }

    function handleBack() {
        const prevPage = getPreviousPage('floor-plan');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    }

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
                                    onClick={() => handleCounterChange('maxGuests', -1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={guests <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{guests}</span>
                                <button
                                    onClick={() => handleCounterChange('maxGuests', 1)}
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
                                    disabled={bedrooms <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{bedrooms}</span>
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
                                    disabled={beds <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{beds}</span>
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
                                    disabled={bathrooms <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{bathrooms}</span>
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
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProgress } from "../HostLayout";

export default function FloorPlanPage() {
    const [guests, setGuests] = useState(1);
    const [bedrooms, setBedrooms] = useState(1);
    const [beds, setBeds] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const { setProgress } = useProgress();

    useEffect(() => {
        setProgress('60%');
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                <div className="max-w-[640px] mx-auto mt-[104px]">
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
                                    onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white"
                                    disabled={guests <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{guests}</span>
                                <button 
                                    onClick={() => setGuests(prev => prev + 1)}
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
                                    onClick={() => setBedrooms(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white"
                                    disabled={bedrooms <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{bedrooms}</span>
                                <button 
                                    onClick={() => setBedrooms(prev => prev + 1)}
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
                                    onClick={() => setBeds(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white"
                                    disabled={beds <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{beds}</span>
                                <button 
                                    onClick={() => setBeds(prev => prev + 1)}
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
                                    onClick={() => setBathrooms(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-gray-600 bg-white"
                                    disabled={bathrooms <= 1}
                                >
                                    <span className="text-xl leading-none relative" style={{top: '-1px'}}>−</span>
                                </button>
                                <span className="w-8 text-center text-base">{bathrooms}</span>
                                <button 
                                    onClick={() => setBathrooms(prev => prev + 1)}
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
            <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
                <div className="max-w-screen-lg mx-auto px-20 py-4 flex justify-between items-center">
                    <Link to="/account/places/location" className="hover:bg-gray-50 px-6 py-3 rounded-lg border border-gray-300 font-medium bg-white">
                        Quay lại
                    </Link>
                    <Link to="/account/places/stand-out" className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800">
                        Tiếp theo
                    </Link>
                </div>
            </div>
        </div>
    );
} 
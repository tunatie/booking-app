import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";

export default function DescriptionPage() {
    const navigate = useNavigate();
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [showTextInput, setShowTextInput] = useState(false);
    const MAX_SELECTIONS = 2;
    const MAX_CHARS = 500;

    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                setSelectedFeatures(data?.standOut || []);
                setDescription(data?.description || "");
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial description data:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!loading) {
            const handler = setTimeout(() => {
                axios.put('/places-form-data', { standOut: selectedFeatures })
                    .catch(err => console.error("Error updating features (standOut):", err));
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [selectedFeatures, loading]);

    useEffect(() => {
        if (!loading && showTextInput) {
            const handler = setTimeout(() => {
                axios.put('/places-form-data', { description: description })
                    .catch(err => console.error("Error updating description:", err));
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [description, loading, showTextInput]);

    function handleNext() {
        if (showTextInput) {
            if (description.trim().length === 0) {
                alert('Vui lòng nhập mô tả');
                return;
            }
            const nextPage = getNextPage('description');
            if (nextPage) {
                navigate(`/account/hosting/${nextPage}`);
            }
        } else {
            axios.put('/places-form-data', { standOut: selectedFeatures })
                .then(() => setShowTextInput(true))
                .catch(err => console.error("Error final update features:", err));
        }
    }

    function handleBack() {
        if (showTextInput) {
            axios.put('/places-form-data', { description: description })
                .then(() => setShowTextInput(false))
                .catch(err => console.error("Error final update description:", err));
        } else {
            const prevPage = getPreviousPage('description');
            if (prevPage) {
                navigate(`/account/hosting/${prevPage}`);
            }
        }
    }

    const features = [
        { id: 'peaceful', icon: '🏠', label: 'Yên bình' },
        { id: 'unique', icon: '🌟', label: 'Độc đáo' },
        { id: 'family', icon: '👨‍👩‍👧‍👦', label: 'Phù hợp cho gia đình' },
        { id: 'stylish', icon: '🎨', label: 'Phong cách' },
        { id: 'central', icon: '🎯', label: 'Vị trí trung tâm' },
        { id: 'spacious', icon: '🌳', label: 'Rộng rãi' }
    ];

    const toggleFeature = (featureId) => {
        setSelectedFeatures(prev => {
            if (prev.includes(featureId)) {
                return prev.filter(id => id !== featureId);
            } else if (prev.length < MAX_SELECTIONS) {
                return [...prev, featureId];
            } else {
                const [, ...rest] = prev;
                return [...rest, featureId];
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (showTextInput) {
        return (
            <div className="min-h-screen flex flex-col">
                <HeaderActions />
                
                <div className="flex-1 pt-[48px] pb-[88px]">
                    <div className="w-full max-w-[640px] mx-auto px-20">
                        <h1 className="text-[32px] font-semibold mb-6">
                            Tạo phần mô tả
                        </h1>
                        <p className="text-gray-500 text-lg mb-8">
                            Chia sẻ những điều tạo nên nét đặc biệt cho chỗ ở của bạn.
                        </p>

                        <div className="relative">
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    const text = e.target.value;
                                    if (text.length <= MAX_CHARS) {
                                        setDescription(text);
                                    }
                                }}
                                className="w-full h-[240px] p-6 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:border-black"
                                placeholder="Bạn có thể chia sẻ về những điểm đặc biệt của không gian, khu vực lân cận, hoặc phong cách trang trí của bạn..."
                                disabled={loading}
                            />
                            <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                                {description.length}/{MAX_CHARS}
                            </div>
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
                            className={`px-6 py-3 rounded-lg font-medium ${description.trim().length > 0
                                    ? 'bg-black text-white hover:bg-[#222222]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={description.trim().length === 0 || loading}
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderActions />
            
            <div className="flex-1 pt-[48px] pb-[88px]">
                <div className="w-full max-w-[640px] mx-auto px-20">
                    <h1 className="text-[32px] font-semibold mb-6">
                        Tiếp theo, hãy mô tả chỗ ở thuộc danh mục nhà của bạn
                    </h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Hãy chọn tối đa 2 điểm nổi bật. Chúng tôi sẽ sử dụng thông tin này để bắt đầu tạo nội dung mô tả của bạn.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {features.map(feature => {
                            const isSelected = selectedFeatures.includes(feature.id);
                            
                            return (
                                <button
                                    key={feature.id}
                                    onClick={() => toggleFeature(feature.id)}
                                    className={`flex items-center gap-3 p-6 border rounded-2xl text-left transition-all h-[72px] ${
                                        isSelected 
                                            ? 'border-black bg-white hover:bg-gray-50' 
                                            : 'bg-[#F7F7F7] border-transparent hover:border-black'
                                    }`}
                                    disabled={loading}
                                >
                                    <span className="text-2xl">{feature.icon}</span>
                                    <span className="font-medium">{feature.label}</span>
                                </button>
                            );
                        })}
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
                        className={`px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-[#222222] ${selectedFeatures.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={selectedFeatures.length === 0 || loading}
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
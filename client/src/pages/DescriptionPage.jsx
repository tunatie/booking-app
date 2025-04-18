import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../utils/axios';
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";
import { useForm } from "../contexts/FormContext";

export default function DescriptionPage() {
    const navigate = useNavigate();
    const { formData, updateFormData } = useForm();
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [showTextInput, setShowTextInput] = useState(false);
    const MAX_SELECTIONS = 2;
    const MAX_CHARS = 500;

    // Load data from FormContext once
    useEffect(() => {
        if (formData) {
            setSelectedFeatures(formData.standOut || []);
            setDescription(formData.description || "");
        }
        setLoading(false);
    }, [formData]);

    function handleNext() {
        if (showTextInput) {
            if (description.trim().length === 0) {
                alert('Vui lòng nhập mô tả');
                return;
            }
            // Save description before navigating
            updateFormData('description', description);
            const nextPage = getNextPage('description');
            if (nextPage) {
                navigate(`/account/hosting/${nextPage}`);
            }
        } else {
            // Save features before showing text input
            updateFormData('standOut', selectedFeatures);
            setShowTextInput(true);
        }
    }

    function handleBack() {
        if (showTextInput) {
            // Save description before going back
            updateFormData('description', description);
            setShowTextInput(false);
        } else {
            // Save features before navigating
            updateFormData('standOut', selectedFeatures);
            const prevPage = getPreviousPage('description');
            if (prevPage) {
                navigate(`/account/hosting/${prevPage}`);
            }
        }
    }

    const handleDescriptionBlur = () => {
        updateFormData('description', description);
    };

    const handleFeaturesChange = (featureId) => {
        const newFeatures = selectedFeatures.includes(featureId)
            ? selectedFeatures.filter(id => id !== featureId)
            : selectedFeatures.length < MAX_SELECTIONS
                ? [...selectedFeatures, featureId]
                : [...selectedFeatures.slice(1), featureId];
                
        setSelectedFeatures(newFeatures);
        updateFormData('standOut', newFeatures);
    };

    const features = [
        { id: 'peaceful', icon: '🏠', label: 'Yên bình' },
        { id: 'unique', icon: '🌟', label: 'Độc đáo' },
        { id: 'family', icon: '👨‍👩‍👧‍👦', label: 'Phù hợp cho gia đình' },
        { id: 'stylish', icon: '🎨', label: 'Phong cách' },
        { id: 'central', icon: '🎯', label: 'Vị trí trung tâm' },
        { id: 'spacious', icon: '🌳', label: 'Rộng rãi' }
    ];

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
                                onBlur={handleDescriptionBlur}
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
                                    onClick={() => handleFeaturesChange(feature.id)}
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../utils/axios';
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";
import { useForm } from "../contexts/FormContext";

export default function TitlePage() {
    const navigate = useNavigate();
    const { formData, updateFormData } = useForm();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const maxLength = 32;
    const minLength = 10;

    // Load title from FormContext
    useEffect(() => {
        if (formData?.title) {
            setTitle(formData.title);
        }
        setLoading(false);
    }, [formData]);

    const handleTitleBlur = () => {
        if (title.trim().length >= minLength) {
            updateFormData('title', title.trim());
        }
    };

    function handleNext() {
        const trimmedTitle = title.trim();
        if (trimmedTitle.length === 0) {
            alert('Vui lòng nhập tiêu đề');
            return;
        }
        if (trimmedTitle.length < minLength) {
            alert(`Tiêu đề phải có ít nhất ${minLength} ký tự`);
            return;
        }
        // Save title before navigating
        updateFormData('title', trimmedTitle);
        const nextPage = getNextPage('title');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    }

    function handleBack() {
        // Save title before going back if it's valid
        if (title.trim().length >= minLength) {
            updateFormData('title', title.trim());
        }
        const prevPage = getPreviousPage('title');
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
        <div className="min-h-screen">
            <HeaderActions />
            
            <div className="h-screen pt-[48px] pb-[88px] flex flex-col">
                <div className="flex-1">
                    <div className="h-full flex flex-col items-center">
                        <div className="w-full max-w-[640px] mx-auto px-20">
                            <h1 className="text-[32px] font-semibold mb-6">
                                Bây giờ, hãy đặt tiêu đề cho chỗ ở thuộc danh mục nhà của bạn
                            </h1>
                            <p className="text-gray-500 text-lg mb-8">
                                Tiêu đề ngắn cho hiệu quả tốt nhất. Đừng lo lắng, bạn luôn có thể thay đổi tiêu đề sau.
                            </p>
                            <div className="relative">
                                <textarea
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value.slice(0, maxLength))}
                                    onBlur={handleTitleBlur}
                                    className="w-full h-[162px] p-6 text-xl border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-black"
                                    placeholder="Nhập tiêu đề (ít nhất 10 ký tự)"
                                    disabled={loading}
                                />
                                <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                                    {title.length}/{maxLength}
                                </div>
                                {title.trim().length > 0 && title.trim().length < minLength && (
                                    <div className="absolute -bottom-6 left-0 text-sm text-red-500">
                                        Tiêu đề phải có ít nhất {minLength} ký tự
                                    </div>
                                )}
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
                            className={`px-6 py-3 rounded-lg font-medium ${
                                title.trim().length >= minLength
                                    ? 'bg-black text-white hover:bg-[#222222]' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={title.trim().length < minLength || loading}
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
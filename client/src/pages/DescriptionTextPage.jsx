import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProgress } from "../HostLayout";

export default function DescriptionTextPage() {
    const { setProgress } = useProgress();
    const [description, setDescription] = useState('');
    const MAX_CHARS = 500;

    useEffect(() => {
        setProgress('98%');
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
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
                        />
                        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                            {description.length}/{MAX_CHARS}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between items-center">
                    <Link
                        to="/account/places/description"
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </Link>
                    <Link 
                        to={description.trim().length > 0 ? "/account/places/new/structure" : ""}
                        className={`px-6 py-3 rounded-lg font-medium ${
                            description.trim().length > 0
                                ? 'bg-black text-white hover:bg-gray-800'
                                : 'bg-white text-gray-500 border border-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Tiếp theo
                    </Link>
                </div>
            </div>
        </div>
    );
} 
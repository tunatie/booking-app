import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProgress } from "../HostLayout";

export default function PublishPage() {
    const { setProgress } = useProgress();

    useEffect(() => {
        setProgress('100%');
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 pt-[48px] pb-[88px]">
                <div className="w-full max-w-[640px] mx-auto px-20">
                    <h1 className="text-[32px] font-semibold mb-4">
                        Xem lại và xuất bản
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Đây là bước cuối cùng trước khi bạn xuất bản nhà/phòng cho thuê của mình. Hãy xem lại mọi thông tin một lần nữa để chắc chắn mọi thứ đều chính xác.
                    </p>

                    {/* Thêm nội dung xem lại ở đây */}
                    
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between items-center">
                    <Link
                        to="/account/places/discount"
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </Link>
                    <button 
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-gray-800"
                        onClick={() => {
                            // Xử lý logic xuất bản ở đây
                        }}
                    >
                        Xuất bản
                    </button>
                </div>
            </div>
        </div>
    );
} 
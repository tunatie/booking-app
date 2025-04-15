import { useNavigate } from "react-router-dom";
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";

export default function StandOutPage() {
    const navigate = useNavigate();

    function handleNext() {
        const nextPage = getNextPage('stand-out');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    }

    function handleBack() {
        const prevPage = getPreviousPage('stand-out');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    }

    return (
        <div className="min-h-screen">
            <HeaderActions />
            
            <div className="h-screen pt-[48px] pb-[88px] flex flex-col">
                <div className="flex-1">
                    <div className="h-full flex items-center">
                        <div className="w-full max-w-[1280px] mx-auto px-20">
                            <div className="grid grid-cols-[minmax(424px,_1fr)_1fr] items-center">
                                {/* Left content */}
                                <div>
                                    <div className="mb-6">
                                        <span className="text-[18px] text-gray-700 font-semibold">Bước 2</span>
                                    </div>
                                    <div>
                                        <h1 className="text-[48px] font-semibold leading-[52px] tracking-[-0.02em] mb-8 text-gray-900">
                                            Làm cho chỗ ở của bạn trở nên nổi bật
                                        </h1>
                                        <p className="text-[22px] leading-[28px] text-gray-600">
                                            Ở bước này, bạn sẽ thêm một số tiện nghi được cung cấp tại chỗ ở của bạn, cùng với 5 bức ảnh trở lên. Sau đó, bạn sẽ soạn tiêu đề và nội dung mô tả.
                                        </p>
                                    </div>
                                </div>

                                {/* Right content - Image */}
                                <div className="flex justify-end items-start">
                                    <img 
                                        src="/house-3d.png"
                                        alt="3D house illustration" 
                                        className="w-[560px] h-[420px] object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
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
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
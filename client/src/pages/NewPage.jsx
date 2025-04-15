import { useNavigate } from "react-router-dom";
import { getNextPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";

export default function NewPage() {
    const navigate = useNavigate();

    function handleNext() {
        const nextPage = getNextPage('new');
        if (nextPage) {
            navigate(`/account/places/${nextPage}`);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderActions />
            
            <div className="flex-1 pt-[48px] pb-[88px] flex items-center">
                <div className="w-full max-w-[640px] mx-auto px-20">
                    <h1 className="text-[32px] font-semibold mb-4">
                        Bạn sẽ cho thuê loại chỗ ở nào?
                    </h1>
                    <p className="text-gray-500">
                        Chọn một lựa chọn phù hợp nhất với chỗ ở của bạn
                    </p>

                    <div className="mt-8 space-y-4">
                        <button 
                            onClick={handleNext}
                            className="w-full p-6 border rounded-2xl flex items-center gap-4 hover:border-black hover:bg-gray-50"
                        >
                            <div className="w-12 h-12">
                                <img src="/images/entire-place.jpg" alt="" className="w-full h-full object-cover rounded-md" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-lg font-medium">Toàn bộ nhà/căn hộ</h3>
                                <p className="text-gray-500">Khách được sử dụng riêng toàn bộ chỗ ở</p>
                            </div>
                        </button>

                        <button 
                            onClick={handleNext}
                            className="w-full p-6 border rounded-2xl flex items-center gap-4 hover:border-black hover:bg-gray-50"
                        >
                            <div className="w-12 h-12">
                                <img src="/images/private-room.jpg" alt="" className="w-full h-full object-cover rounded-md" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-lg font-medium">Phòng riêng</h3>
                                <p className="text-gray-500">Khách có phòng riêng để ngủ và có thể sử dụng một số khu vực chung</p>
                            </div>
                        </button>

                        <button 
                            onClick={handleNext}
                            className="w-full p-6 border rounded-2xl flex items-center gap-4 hover:border-black hover:bg-gray-50"
                        >
                            <div className="w-12 h-12">
                                <img src="/images/shared-room.jpg" alt="" className="w-full h-full object-cover rounded-md" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-lg font-medium">Phòng chung</h3>
                                <p className="text-gray-500">Khách ngủ trong phòng hoặc khu vực chung mà người khác cũng có thể sử dụng</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/account/places/overview')}
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
} 
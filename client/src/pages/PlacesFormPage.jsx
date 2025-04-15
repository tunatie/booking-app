import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProgress } from "../HostLayout";
import { getPageProgress } from "../utils/pageOrder";

export default function PlacesFormPage() {
    const navigate = useNavigate();
    const { setProgress } = useProgress();

    useEffect(() => {
        const progress = getPageProgress('new');
        setProgress(progress.step1);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Main content */}
            <div className="flex-1 flex items-center">
                <div className="max-w-screen-lg mx-auto w-full px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-sm font-medium mb-2">Bước 1</h2>
                        <h1 className="text-2xl font-medium mb-8">
                            Chia sẻ thông tin về chỗ ở của bạn cho chúng tôi
                        </h1>
                        <p className="text-gray-500">
                            Trong bước này, chúng tôi sẽ hỏi xem bạn cho thuê loại chỗ ở nào và bạn muốn cho khách đặt toàn bộ nhà hay chỉ một phòng cụ thể. Sau đó, hãy cho chúng tôi biết vị trí và số lượng khách có thể ở tại đó.
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between">
                    <Link
                        to="/account/hosting/overview"
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </Link>
                    <button
                        onClick={() => navigate('/account/hosting/structure')}
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-[#222222]"
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
}
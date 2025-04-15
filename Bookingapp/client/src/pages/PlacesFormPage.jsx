import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../HostLayout";

export default function PlacesFormPage() {
    const navigate = useNavigate();
    const { setProgress } = useProgress();

    useEffect(() => {
        setProgress('0%');
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
                {/* Buttons */}
                <div className="max-w-screen-lg mx-auto px-6 py-4 flex justify-between items-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-lg border border-gray-200 font-medium bg-white"
                    >
                        Quay lại
                    </button>
                    <button 
                        onClick={() => navigate('/account/places/structure')}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
}
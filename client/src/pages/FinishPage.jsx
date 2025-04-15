import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useProgress } from "../HostLayout";
import HeaderActions from "../components/HeaderActions";

export default function FinishPage() {
    const { setProgress } = useProgress();

    useEffect(() => {
        setProgress('100%');
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderActions />
            
            <div className="flex-1 pt-[48px] pb-[88px] flex items-center">
                <div className="w-full max-w-[1280px] mx-auto px-20">
                    <div className="grid grid-cols-[1fr,1fr] gap-20">
                        <div className="max-w-[560px] flex items-center">
                            <div>
                                <div className="mb-8">
                                    <span className="text-sm font-medium">Bước 3</span>
                                    <h1 className="text-[32px] font-semibold mt-2">
                                        Hoàn thiện và đăng
                                    </h1>
                                </div>
                                <p className="text-gray-500 text-lg">
                                    Cuối cùng, bạn sẽ chọn cài đặt đặt phòng, thiết lập giá và đăng mục cho thuê.
                                </p>
                            </div>
                        </div>

                        <div>
                            <img 
                                src="/finish-illustration.png"
                                alt="Room illustration"
                                className="w-full h-auto rounded-3xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between">
                    <Link
                        to="/account/hosting/description"
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </Link>
                    <Link
                        to="/account/hosting/booking-settings"
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-[#222222]"
                    >
                        Tiếp theo
                    </Link>
                </div>
            </div>
        </div>
    );
} 
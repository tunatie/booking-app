import { createContext, useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getPageProgress } from "./utils/pageOrder";
import HostHeader from "./components/HostHeader";

export const ProgressContext = createContext();

export function useProgress() {
    return useContext(ProgressContext);
}

export default function HostLayout() {
    const location = useLocation();
    const currentPage = location.pathname.split("/").pop();
    const [progress, setProgress] = useState(getPageProgress(currentPage));

    // Update progress whenever location changes
    useEffect(() => {
        const page = location.pathname.split("/").pop();
        const newProgress = getPageProgress(page);
        setProgress(newProgress);
    }, [location.pathname]);

    // Kiểm tra nếu đang ở trang celebration hoặc trang chính
    if (location.pathname === "/account/hosting/celebration" || location.pathname === "/account/hosting") {
        return (
            <>
                {location.pathname === "/account/hosting" && <HostHeader />}
                <Outlet />
            </>
        );
    }

    // Kiểm tra nếu đang trong quá trình tạo phòng mới
    const isCreatingNewPlace = location.pathname.includes("/account/hosting/new") || 
                             location.pathname.includes("/overview") ||
                             location.pathname.includes("/structure") ||
                             location.pathname.includes("/privacy-type") ||
                             location.pathname.includes("/location") ||
                             location.pathname.includes("/floor-plan") ||
                             location.pathname.includes("/stand-out") ||
                             location.pathname.includes("/amenities") ||
                             location.pathname.includes("/photos") ||
                             location.pathname.includes("/title") ||
                             location.pathname.includes("/description") ||
                             location.pathname.includes("/finish") ||
                             location.pathname.includes("/booking-settings") ||
                             location.pathname.includes("/guest-type") ||
                             location.pathname.includes("/price") ||
                             location.pathname.includes("/discount") ||
                             location.pathname.includes("/security") ||
                             location.pathname.includes("/receipt");

    return (
        <ProgressContext.Provider value={{ progress, setProgress }}>
            <div className="min-h-screen flex flex-col">
                {!isCreatingNewPlace && <HostHeader />}
                {isCreatingNewPlace && (
                    <div className="border-b">
                        <div className="max-w-[1280px] mx-auto px-20 py-6">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="h-2 rounded-full bg-[#DDDDDD]">
                                        <div
                                            className="h-full rounded-full bg-black transition-all duration-300"
                                            style={{ width: `${progress.step1}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 text-sm text-[#717171]">Bước 1</div>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 rounded-full bg-[#DDDDDD]">
                                        <div
                                            className="h-full rounded-full bg-black transition-all duration-300"
                                            style={{ width: `${progress.step2}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 text-sm text-[#717171]">Bước 2</div>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 rounded-full bg-[#DDDDDD]">
                                        <div
                                            className="h-full rounded-full bg-black transition-all duration-300"
                                            style={{ width: `${progress.step3}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 text-sm text-[#717171]">Bước 3</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Outlet />
            </div>
        </ProgressContext.Provider>
    );
} 
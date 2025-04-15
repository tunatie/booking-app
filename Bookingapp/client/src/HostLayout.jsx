import { createContext, useContext, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const ProgressContext = createContext();

export function useProgress() {
    return useContext(ProgressContext);
}

export default function HostLayout() {
    const location = useLocation();
    const [progress, setProgress] = useState(() => {
        // Calculate initial progress based on current route
        const route = location.pathname;
        if (route.includes('/account/places/new')) return '0%';
        if (route.includes('/account/places/structure')) return '15%';
        if (route.includes('/account/places/privacy-type')) return '30%';
        if (route.includes('/account/places/location')) return '45%';
        if (route.includes('/account/places/floor-plan')) return '60%';
        if (route.includes('/account/places/stand-out')) return '70%';
        if (route.includes('/account/places/amenities')) return '80%';
        if (route.includes('/account/places/photos')) return '90%';
        if (route.includes('/account/places/description')) return '100%';
        return '0%';
    });

    return (
        <ProgressContext.Provider value={{ progress, setProgress }}>
            <div className="min-h-screen w-full">
                <div className="w-full h-full">
                    <Outlet />
                </div>
                
                {/* Progress bar */}
                <div className="fixed bottom-20 left-0 right-0">
                    <div className="w-full px-6">
                        <div className="h-1 bg-gray-200">
                            <div 
                                className="h-1 bg-black transition-all duration-500"
                                style={{ width: progress }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </ProgressContext.Provider>
    );
} 
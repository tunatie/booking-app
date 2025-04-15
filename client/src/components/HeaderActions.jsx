import { useNavigate } from "react-router-dom";

export default function HeaderActions() {
    const navigate = useNavigate();

    const handleSaveAndExit = () => {
        // Lưu state hiện tại vào localStorage
        const currentPath = window.location.pathname;
        localStorage.setItem('lastSavedPath', currentPath);
        
        // Chuyển về trang Places
        navigate('/account/hosting');
    };

    const handleClose = () => {
        // Xóa tất cả dữ liệu trong localStorage
        const keysToKeep = ['user', 'token']; // Giữ lại những key cần thiết
        Object.keys(localStorage).forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        // Chuyển về trang Places
        navigate('/account/hosting');
    };

    return (
        <div className="fixed top-0 right-0 p-6 flex gap-4">
            <button
                onClick={handleSaveAndExit}
                className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2 text-black underline"
            >
                Lưu và thoát
            </button>
            <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
} 
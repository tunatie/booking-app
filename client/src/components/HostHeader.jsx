import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../UserContext.jsx';

export default function HostHeader() {
    const [showMenu, setShowMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);
    const userMenuRef = useRef(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-1">
                        <img src="/logo/logo1.png" alt="Logo" className="h-16 w-auto" />
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6 relative">
                        <Link to="/account/hosting" className="font-medium text-gray-600 hover:text-gray-800">
                            Hôm nay
                        </Link>
                        <Link to="/account/hosting/calendar" className="font-medium text-gray-600 hover:text-gray-800">
                            Lịch
                        </Link>
                        <Link to="/account/hosting/listings" className="font-medium text-gray-600 hover:text-gray-800">
                            Nhà/phòng cho thuê
                        </Link>
                        <Link to="/messages" className="font-medium text-gray-600 hover:text-gray-800">
                            Tin nhắn
                        </Link>
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1 bg-white"
                            >
                                Menu
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            
                            {showMenu && (
                                <div className="absolute left-0 mt-2 py-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                                    <Link to="/account/hosting" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                        Đặt phòng
                                    </Link>
                                    <Link to="/account/hosting/insights" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                        Thu nhập
                                    </Link>
                                    <Link to="/account/hosting/super-host" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                        Thông tin phân tích
                                    </Link>
                                    <Link to="/account/hosting/settings" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                        Tạo mục cho thuê mới
                                    </Link>
                                    <div className="border-t border-gray-300"></div>
                                    <Link to="/account/hosting/settings" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                        Sách hướng dẫn
                                    </Link>
                                    <Link to="/account/hosting/settings" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                        Khám phá các nguồn hỗ trợ đón tiếp khách
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right Menu */}
                    <div className="flex items-center gap-4">
                        
                        <div className="relative" ref={userMenuRef}>
                            <button 
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 border rounded-full py-2 px-4 hover:shadow-md transition-shadow bg-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 py-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100">
                                    <div className="py-2">
                                        <Link to={`/users/show/${user?._id}`} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Hồ sơ
                                        </Link>
                                        <Link to="/account-settings" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Tài khoản
                                        </Link>
                                        <Link to="/account/edit" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Truy cập trung tâm trợ giúp
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-300"></div>
                                    <div className="py-2">
                                        <Link to="/language" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Ngôn ngữ và dịch
                                        </Link>
                                        <Link to="/currency" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            đ VND
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-300"></div>
                                    <div className="py-2">
                                        <Link to="/host" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Giới thiệu cho nhà
                                        </Link>
                                        <Link to="/test" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Tổ chức trải nghiệm
                                        </Link>
                                        <Link to="/" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                            Chuyển sang chế độ du lịch
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-300"></div>
                                    <div className="py-2">
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 bg-white">
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 
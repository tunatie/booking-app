import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext, useState, useRef, useEffect } from "react";
import LanguageModal from "./LanguageModal";
import AuthModal from "./AuthModal";
import axios from "../utils/axios";

export default function Header() {
  const {user, setUser} = useContext(UserContext);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <>
      <header className="flex justify-between items-center px-8 py-4 border-b">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-0">
          <span className="font-bold text-xl text-slate-700 mr-[-4px]">TUAN</span>
          <img src="/logo/logo1.png" alt="Booking App Logo" className="h-16" />
          <span className="font-bold text-xl text-slate-700 ml-[-4px]">KIET</span>
        </Link>

        {/* Search Bar */}
        <div className="flex items-center h-12 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col justify-center h-full px-4 cursor-pointer rounded-full transition hover:bg-gray-100">
            <span className="text-[12px] font-semibold">Địa điểm</span>
            <span className="text-[12px] text-gray-500">Tìm kiếm điểm đến</span>
          </div>
          <div className="h-6 w-[1px] bg-gray-300"></div>
          <div className="flex flex-col justify-center h-full px-4 cursor-pointer rounded-full transition hover:bg-gray-100">
            <span className="text-[12px] font-semibold">Nhận phòng</span>
            <span className="text-[12px] text-gray-500">Thêm ngày</span>
          </div>
          <div className="h-6 w-[1px] bg-gray-300"></div>
          <div className="flex flex-col justify-center h-full px-4 cursor-pointer rounded-full transition hover:bg-gray-100">
            <span className="text-[12px] font-semibold">Trả phòng</span>
            <span className="text-[12px] text-gray-500">Thêm ngày</span>
          </div>
          <div className="h-6 w-[1px] bg-gray-300"></div>
          <div className="flex flex-col justify-center h-full px-4 cursor-pointer rounded-full transition hover:bg-gray-100">
            <span className="text-[12px] font-semibold">Khách</span>
            <span className="text-[12px] text-gray-500">Thêm khách</span>
          </div>
          <button className="flex items-center bg-rose-500 text-white p-2 rounded-full ml-2 mr-1 hover:bg-rose-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Link to="/host" className="text-[14px] font-medium px-4 py-3 rounded-full hover:bg-gray-100">
            Cho thuê chỗ ở qua TUANKIET
          </Link>
          <button 
            onClick={() => setIsLanguageModalOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </button>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1 border border-gray-300 rounded-full py-1 px-2 hover:shadow-md transition-shadow bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <div className="bg-gray-500 text-white rounded-full overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[30px] h-[30px] relative top-1">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              {!!user && (
                <div className="text-[14px] font-medium">
                  {user.name}
                </div>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-md border border-gray-200 py-2 z-50">
                {!user && (
                  <>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }} 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 bg-white"
                    >
                      Đăng nhập
                    </button>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 bg-white"
                    >
                      Đăng ký
                    </button>
                    <hr className="my-2 border-gray-200" />
                  </>
                )}
                {user && (
                  <>
                    <Link to="/messages" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Tin nhắn
                    </Link>
                    <Link to="/trips" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Chuyến đi
                    </Link>
                    <Link to="/wishlists" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Danh sách yêu thích
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <Link to="/account/hosting" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Quản lý nhà/phòng cho thuê
                    </Link>
                    <Link to="/host/experiences" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Tổ chức trải nghiệm
                    </Link>
                    <Link to="/host/refer" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Giới thiệu chủ nhà
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <Link to="/account" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Tài khoản
                    </Link>
                    <Link to="/help" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Trung tâm trợ giúp
                    </Link>
                    <button 
                      onClick={async () => {
                        await axios.post('/logout');
                        setUser(null);
                        setIsMenuOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 bg-white"
                    >
                      Đăng xuất
                    </button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/host" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Cho thuê chỗ ở qua TTK
                    </Link>
                    <button onClick={() => setIsLanguageModalOpen(true)} className="w-full text-left px-4 py-2 hover:bg-gray-100 bg-white">
                      Ngôn ngữ & Tiền tệ
                    </button>
                    <Link to="/help" className="block px-4 py-2 hover:bg-gray-100 bg-white">
                      Trợ giúp
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <LanguageModal 
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
} 
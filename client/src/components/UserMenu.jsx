import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-3 border rounded-full py-2 px-3 hover:shadow-md transition cursor-pointer"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

        <div className="bg-gray-500 rounded-full p-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="white" 
            className="w-5 h-5"
          >
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-xl shadow-md border z-50">
          <div className="py-2">
            <div 
              onClick={() => {
                navigate('/messages');
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              Tin nhắn
            </div>
            <div 
              onClick={() => {
                navigate('/trips');
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              Chuyến đi
            </div>
            <div 
              onClick={() => {
                navigate('/wishlist');
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              Danh sách yêu thích
            </div>
          </div>
          <hr />
          <div className="py-2">
            <div 
              onClick={() => {
                navigate('/host-experience');
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              Tổ chức trải nghiệm
            </div>
            <div 
              onClick={() => {
                navigate('/become-host');
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              Giới thiệu chủ nhà
            </div>
            <div 
              onClick={() => {
                navigate('/account');
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              Tài khoản
            </div>
          </div>
          <hr />
          <div className="py-2">
            <div 
              onClick={() => navigate('/login')}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              Đăng nhập
            </div>
            <div 
              onClick={() => navigate('/register')}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              Đăng ký
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 
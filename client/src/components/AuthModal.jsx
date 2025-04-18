import { useState, useContext } from 'react';
import axios from '../utils/axios';
import { UserContext } from '../UserContext';

export default function AuthModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (isRegistering && !name)) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        // Xử lý đăng ký
        const response = await axios.post('/register', {
          name,
          email,
          password
        });
        if (response.data) {
          // Sau khi đăng ký thành công, tự động đăng nhập
          const loginResponse = await axios.post('/login', {
            email,
            password
          });
          if (loginResponse.data) {
            setUser(loginResponse.data);
            onClose();
          }
        }
      } else {
        // Xử lý đăng nhập
        try {
          const response = await axios.post('/login', {
            email,
            password
          });
          if (response.data) {
            setUser(response.data);
            onClose();
          }
        } catch (err) {
          if (err.response?.status === 400) {
            // Email chưa tồn tại, chuyển sang form đăng ký
            setIsRegistering(true);
            setError('Email chưa được đăng ký. Vui lòng điền thêm thông tin để đăng ký tài khoản mới.');
          } else if (err.response?.status === 422) {
            setError('Mật khẩu không chính xác');
          } else {
            setError('Có lỗi xảy ra, vui lòng thử lại sau');
          }
        }
      }
    } catch (err) {
      if (err.response?.data === 'user not found') {
        setIsRegistering(true);
        setError('Email chưa được đăng ký. Vui lòng điền thêm thông tin để đăng ký tài khoản mới.');
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-base font-semibold">{isRegistering ? 'Đăng ký' : 'Đăng nhập'}</h2>
          <div className="w-5"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-6">Chào mừng bạn đến với Airbnb</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Họ tên"
                  className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                  disabled={loading}
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full p-3 bg-[#FF385C] text-white rounded-lg font-medium hover:bg-[#E31C5F] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (isRegistering ? 'Đăng ký' : 'Đăng nhập')}
            </button>

            {isRegistering && (
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-sm text-gray-500 hover:underline bg-transparent p-2"
                  disabled={loading}
                >
                  Đã có tài khoản? Đăng nhập
                </button>
              </div>
            )}
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button 
              disabled={loading}
              className="relative w-full p-3 border border-black rounded-lg hover:bg-gray-50 bg-white disabled:opacity-50"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              </div>
              <span className="block text-center">Tiếp tục với Google</span>
            </button>
            <button 
              disabled={loading}
              className="relative w-full p-3 border border-black rounded-lg hover:bg-gray-50 bg-white disabled:opacity-50"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              </div>
              <span className="block text-center">Tiếp tục với Apple</span>
            </button>
            <button 
              disabled={loading}
              className="relative w-full p-3 border border-black rounded-lg hover:bg-gray-50 bg-white disabled:opacity-50"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <span className="block text-center">Tiếp tục bằng email</span>
            </button>
            <button 
              disabled={loading}
              className="relative w-full p-3 border border-black rounded-lg hover:bg-gray-50 bg-white disabled:opacity-50"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <span className="block text-center">Tiếp tục với Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
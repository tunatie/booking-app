import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { UserContext } from "../UserContext";
import { useContext } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);

    async function handleLoginSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            
            // Kiểm tra email và password
            if (!email || !password) {
                setError('Vui lòng nhập đầy đủ email và mật khẩu');
                return;
            }

            const { data } = await axios.post('/login', {
                email,
                password
            });

            setUser(data);
            setRedirect(true);
        } catch (e) {
            console.error('Login error:', e);
            if (e.response) {
                if (e.response.status === 400) {
                    setError('Không tìm thấy tài khoản với email này');
                } else if (e.response.status === 422) {
                    setError('Mật khẩu không đúng');
                } else {
                    setError(e.response.data || 'Có lỗi xảy ra khi đăng nhập');
                }
            } else if (e.request) {
                setError('Không thể kết nối đến server');
            } else {
                setError('Có lỗi xảy ra, vui lòng thử lại');
            }
        } finally {
            setLoading(false);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Đăng nhập</h1>
                <form className="max-w-lg mx-auto" onSubmit={handleLoginSubmit}>
                    {error && (
                        <div className="text-center p-2 mb-4 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    <input 
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <input 
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <button 
                        className="primary"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                    <div className="text-center py-2 text-gray-500">
                        Chưa có tài khoản? <Link className="underline text-black" to={'/register'}>Đăng ký ngay</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
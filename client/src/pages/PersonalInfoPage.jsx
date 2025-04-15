import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function PersonalInfoPage() {
    const { user } = useContext(UserContext);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-8 py-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/account-settings" className="hover:underline">Tài khoản</Link>
                    <span>/</span>
                    <span>Thông tin cá nhân</span>
                </div>

                <h1 className="text-2xl font-medium mb-8">Thông tin cá nhân</h1>

                <div className="space-y-6 max-w-2xl">
                    {/* Tên pháp lý */}
                    <div className="flex justify-between items-center border-b pb-6">
                        <div className="flex-1 pr-4">
                            <h3 className="font-medium">Tên pháp lý</h3>
                            <p className="text-gray-500 text-sm mt-1">{user?.name || "Chưa được cung cấp"}</p>
                        </div>
                        <button className="btn-underline whitespace-nowrap">Chỉnh sửa</button>
                    </div>

                    {/* Tên sử dụng */}
                    <div className="flex justify-between items-center border-b pb-6">
                        <div className="flex-1 pr-4">
                            <h3 className="font-medium">Tên sử dụng</h3>
                            <p className="text-gray-500 text-sm mt-1">Chưa được cung cấp</p>
                        </div>
                        <button className="btn whitespace-nowrap">Thêm</button>
                    </div>

                    {/* Địa chỉ email */}
                    <div className="flex justify-between items-center border-b pb-6">
                        <div className="flex-1 pr-4">
                            <h3 className="font-medium">Địa chỉ email</h3>
                            <p className="text-gray-500 text-sm mt-1">{user?.email || "Chưa được cung cấp"}</p>
                        </div>
                        <button className="btn-underline whitespace-nowrap">Chỉnh sửa</button>
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex justify-between items-start border-b pb-6">
                        <div className="flex-1 pr-4">
                            <h3 className="font-medium">Số điện thoại</h3>
                            <p className="text-gray-500 text-sm mt-1">Chưa được cung cấp</p>
                            <p className="text-gray-500 text-sm mt-2 leading-normal">
                                Số điện thoại bí mật của bạn sẽ chỉ được chia sẻ với khách đã xác nhận và Airbnb B&B. 
                                Bạn có thể thêm các số điện thoại khác và chọn mục đích sử dụng tương ứng.
                            </p>
                        </div>
                        <button className="btn-underline whitespace-nowrap">Chỉnh sửa</button>
                    </div>

                    {/* Xác minh danh tính */}
                    <div className="flex justify-between items-center border-b pb-6">
                        <div className="flex-1 pr-4">
                            <h3 className="font-medium">Xác minh danh tính</h3>
                            <p className="text-gray-500 text-sm mt-1">Đã xác minh</p>
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div className="flex justify-between items-center border-b pb-6">
                        <div className="flex-1 pr-4">
                            <h3 className="font-medium">Địa chỉ</h3>
                            <p className="text-gray-500 text-sm mt-1">Chưa được cung cấp</p>
                        </div>
                        <button className="btn-underline whitespace-nowrap">Chỉnh sửa</button>
                    </div>

                    {/* Liên hệ trong trường hợp khẩn cấp */}
                    <div className="flex justify-between items-center pb-6">
                        <div className="flex-1 pr-4">
                            <h3 className="font-medium">Liên hệ trong trường hợp khẩn cấp</h3>
                            <p className="text-gray-500 text-sm mt-1">Chưa được cung cấp</p>
                        </div>
                        <button className="btn whitespace-nowrap">Thêm</button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
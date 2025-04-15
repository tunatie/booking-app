import React from 'react';

const BecomeHost = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-6">Giới thiệu chủ nhà mới</h1>

        <div className="aspect-w-16 aspect-h-9 mb-8">
          <img
            src="/images/become-host.jpg"
            alt="Become a Host"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Giới thiệu bạn bè trở thành chủ nhà</h2>
            <p className="text-gray-600">
              Mời bạn bè của bạn tham gia cộng đồng chủ nhà TUANKIET và nhận thưởng khi họ bắt đầu đón tiếp khách.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cách thức hoạt động</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Chia sẻ đường dẫn</h3>
                <p className="text-gray-600">Gửi đường dẫn giới thiệu độc quyền của bạn cho bạn bè.</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Bạn bè đăng ký</h3>
                <p className="text-gray-600">Họ đăng ký làm chủ nhà thông qua đường dẫn của bạn.</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Nhận thưởng</h3>
                <p className="text-gray-600">Bạn nhận thưởng khi họ hoàn thành chuyến đón tiếp đầu tiên.</p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Đường dẫn giới thiệu của bạn</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value="https://tuankiet.vn/become-host?ref=123456"
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-white"
              />
              <button className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                Sao chép
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Tôi có thể giới thiệu bao nhiêu người?</h3>
                <p className="text-gray-600">Bạn có thể giới thiệu không giới hạn số lượng chủ nhà mới.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Khi nào tôi nhận được tiền thưởng?</h3>
                <p className="text-gray-600">Tiền thưởng sẽ được chuyển vào tài khoản của bạn sau khi chủ nhà mới hoàn thành chuyến đón tiếp đầu tiên.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Mức thưởng là bao nhiêu?</h3>
                <p className="text-gray-600">Mức thưởng sẽ thay đổi theo từng thời điểm và khu vực. Vui lòng xem chi tiết trong điều khoản chương trình.</p>
              </div>
            </div>
          </section>

          <div className="text-center">
            <button className="px-8 py-4 bg-rose-500 text-white rounded-lg text-lg font-medium hover:bg-rose-600 transition-colors">
              Bắt đầu giới thiệu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeHost; 
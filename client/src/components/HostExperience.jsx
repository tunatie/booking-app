import React from 'react';

const HostExperience = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-6">Tổ chức trải nghiệm cùng TUANKIET</h1>
        
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <img
            src="/images/host-experience.jpg"
            alt="Host Experience"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Chia sẻ sở thích của bạn</h2>
            <p className="text-gray-600">
              Dẫn dắt du khách khám phá thế giới độc đáo của bạn. Chúng tôi sẽ hỗ trợ bạn trong từng bước.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tại sao nên tổ chức trải nghiệm?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Kiếm thêm thu nhập</h3>
                <p className="text-gray-600">Tạo nguồn thu nhập bổ sung bằng cách chia sẻ đam mê của bạn.</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Gặp gỡ mọi người</h3>
                <p className="text-gray-600">Kết nối với du khách từ khắp nơi trên thế giới.</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Chia sẻ đam mê</h3>
                <p className="text-gray-600">Giúp người khác khám phá những điều bạn yêu thích.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cách thức bắt đầu</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Cho chúng tôi biết về trải nghiệm của bạn</h3>
                  <p className="text-gray-600">Chia sẻ chi tiết về hoạt động bạn muốn tổ chức.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Chúng tôi sẽ hướng dẫn bạn</h3>
                  <p className="text-gray-600">Nhận hỗ trợ về cách tạo và quản lý trải nghiệm của bạn.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Bắt đầu đón tiếp khách</h3>
                  <p className="text-gray-600">Xuất bản và bắt đầu đón tiếp khách từ khắp nơi trên thế giới.</p>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center">
            <button className="px-8 py-4 bg-rose-500 text-white rounded-lg text-lg font-medium hover:bg-rose-600 transition-colors">
              Bắt đầu tổ chức
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostExperience; 
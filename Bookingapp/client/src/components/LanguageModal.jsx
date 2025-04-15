import { useState } from 'react';

export default function LanguageModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('language');
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);

  if (!isOpen) return null;

  const languages = [
    { code: 'fr', name: 'Français', region: 'France' },
    { code: 'en-us', name: 'English', region: 'United States' },
    { code: 'en-gb', name: 'English', region: 'United Kingdom' },
    { code: 'vi', name: 'Tiếng Việt', region: 'Việt Nam' },
    { code: 'id', name: 'Bahasa Indonesia', region: 'Indonesia' },
    { code: 'bs', name: 'Bosanski', region: 'Bosna i Hercegovina' },
    { code: 'ca', name: 'Català', region: 'Espanya' },
    { code: 'cs', name: 'Čeština', region: 'Česká republika' },
    { code: 'da', name: 'Dansk', region: 'Danmark' },
    { code: 'de', name: 'Deutsch', region: 'Deutschland' },
    { code: 'et', name: 'Eesti', region: 'Eesti' },
    { code: 'en-au', name: 'English', region: 'Australia' },
    { code: 'en-ca', name: 'English', region: 'Canada' },
    { code: 'es', name: 'Español', region: 'España' },
    { code: 'es-ar', name: 'Español', region: 'Argentina' },
    { code: 'es-cl', name: 'Español', region: 'Chile' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('language')}
              className={`px-4 py-2 font-medium bg-white ${activeTab === 'language' ? 'border-b-2 border-black' : ''}`}
            >
              Ngôn ngữ và khu vực
            </button>
            <button 
              onClick={() => setActiveTab('currency')}
              className={`px-4 py-2 font-medium bg-white ${activeTab === 'currency' ? 'border-b-2 border-black' : ''}`}
            >
              Loại tiền tệ
            </button>
          </div>
          <div className="w-5"></div>
        </div>

        {/* Content */}
        <div className="p-6 bg-white">
          {activeTab === 'language' && (
            <>
              {/* Translation Toggle */}
              <div className="border rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Bản dịch</h3>
                    <p className="text-sm text-gray-500">Dịch tự động nội dung mô tả và đánh giá sang Tiếng Việt.</p>
                  </div>
                  <button 
                    onClick={() => setIsTranslationEnabled(!isTranslationEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${isTranslationEnabled ? 'bg-black' : 'bg-gray-200'} relative`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${isTranslationEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
              </div>

              {/* Language Grid */}
              <div className="grid grid-cols-3 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-sm text-gray-500">{lang.region}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === 'currency' && (
            <div className="text-center py-8 text-gray-500">
              Tính năng đang được phát triển
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
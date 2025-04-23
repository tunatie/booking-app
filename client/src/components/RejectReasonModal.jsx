import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const REJECT_REASONS = [
  'Chỗ ở không sẵn sàng (bảo trì, sửa chữa, sự cố khẩn cấp)',
  'Số lượng khách vượt quá quy định',
  'Không đáp ứng được yêu cầu đặc biệt của khách',
  'Đã có khách khác đặt cùng thời gian',
  'Khách không cung cấp đủ thông tin',
  'Lý do cá nhân',
  'Khác',
];

export default function RejectReasonModal({ isOpen, onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const handleConfirm = () => {
    let reason = selectedReason;
    if (selectedReason === 'Khác') {
      reason = otherReason.trim() ? otherReason : 'Khác';
    }
    if (!reason) return;
    onSubmit(reason);
    setSelectedReason('');
    setOtherReason('');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-6 pt-6 pb-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    Chọn lý do từ chối đặt phòng
                  </Dialog.Title>
                  <div className="space-y-3">
                    {REJECT_REASONS.map((reason) => (
                      <div key={reason} className="flex items-center">
                        <input
                          type="radio"
                          id={reason}
                          name="reject-reason"
                          value={reason}
                          checked={selectedReason === reason}
                          onChange={() => setSelectedReason(reason)}
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor={reason} className="ml-2 text-sm text-gray-700">
                          {reason}
                        </label>
                      </div>
                    ))}
                    {selectedReason === 'Khác' && (
                      <textarea
                        className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                        rows={3}
                        placeholder="Nhập lý do cụ thể..."
                        value={otherReason}
                        onChange={e => setOtherReason(e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    onClick={handleConfirm}
                    disabled={!selectedReason || (selectedReason === 'Khác' && !otherReason.trim())}
                  >
                    Xác nhận từ chối
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 
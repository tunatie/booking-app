import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from 'date-fns/locale/vi';

registerLocale('vi', vi);

// Custom CSS để override style mặc định
const calendarStyles = `
  .react-datepicker {
    font-family: -apple-system, system-ui, "Segoe UI", Roboto;
    border: none;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .react-datepicker__header {
    background-color: white;
    border-bottom: none;
    padding-top: 12px;
  }
  .react-datepicker__day-name {
    color: #666;
    font-weight: 500;
  }
  .react-datepicker__day {
    border-radius: 50%;
    color: #333;
  }
  .react-datepicker__day:hover {
    background-color: #f0f0f0;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--in-range {
    background-color: #0071c2 !important;
    color: white !important;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #0071c2;
    color: white;
  }
  .react-datepicker__navigation {
    top: 12px;
  }
  .react-datepicker__current-month {
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

axios.defaults.baseURL = 'http://localhost:4000';

export default function BookingWidget({place}) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const {user} = useContext(UserContext);

  // Thêm style vào document khi component mount
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = calendarStyles;
    document.head.appendChild(styleElement);
    return () => styleElement.remove();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  const total = numberOfNights * place.price;
  const serviceFee = Math.floor(total * 0.12);
  const cleaningFee = Math.floor(place.price * 0.1);
  const finalTotal = total + serviceFee + cleaningFee;

  async function bookThisPlace() {
    const response = await axios.post('/bookings', {
      checkIn, checkOut, numberOfGuests, name, phone,
      place: place._id,
      price: finalTotal,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  const CustomInput = ({value, onClick, placeholder}) => (
    <div onClick={onClick} className="cursor-pointer">
      <input
        type="text"
        value={value}
        readOnly
        placeholder={placeholder}
        className="text-sm outline-none cursor-pointer w-full"
      />
    </div>
  );

  const Footer = ({date, setSelectedDate}) => (
    <div className="flex justify-between items-center p-2 border-t">
      <button
        className="text-sm underline"
        onClick={() => setSelectedDate(null)}
      >
        Xóa ngày
      </button>
      <button
        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        onClick={() => {}}
      >
        Đóng
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border p-6 sticky top-8">
      <div className="mb-4">
        <span className="text-2xl font-semibold">${place.price}</span>
        <span className="text-gray-500"> / đêm</span>
      </div>
      
      <div className="border rounded-xl">
        <div className="flex">
          <div className="py-4 px-4 border-r flex-1">
            <label className="block text-xs font-medium">NHẬN PHÒNG</label>
            <input type="date" 
              value={checkIn} 
              onChange={ev => setCheckIn(ev.target.value)}
              className="mt-1 w-full" 
            />
          </div>
          <div className="py-4 px-4 flex-1">
            <label className="block text-xs font-medium">TRẢ PHÒNG</label>
            <input type="date" 
              value={checkOut} 
              onChange={ev => setCheckOut(ev.target.value)}
              className="mt-1 w-full" 
            />
          </div>
        </div>
        <div className="py-4 px-4 border-t">
          <label className="block text-xs font-medium">KHÁCH</label>
          <input type="number" 
            value={numberOfGuests}
            onChange={ev => setNumberOfGuests(ev.target.value)}
            min={1} 
            max={place.maxGuests}
            className="mt-1 w-full" 
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-4 px-4 border-t">
            <label className="block text-xs font-medium mb-2">THÔNG TIN LIÊN HỆ</label>
            <input type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
              placeholder="Họ tên"
              className="w-full mb-2 border rounded-lg px-2 py-1"
            />
            <input type="tel"
              value={phone}
              onChange={ev => setPhone(ev.target.value)}
              placeholder="Số điện thoại"
              className="w-full border rounded-lg px-2 py-1"
            />
          </div>
        )}
      </div>

      <button className="primary mt-4 w-full" onClick={bookThisPlace}>
        {numberOfNights > 0 ? 'Đặt phòng' : 'Chọn ngày'}
      </button>

      {numberOfNights > 0 && (
        <div className="mt-4 text-sm">
          <div className="flex justify-between py-2">
            <span className="underline">${place.price} x {numberOfNights} đêm</span>
            <span>${total}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="underline">Phí dịch vụ</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="underline">Phí dọn dẹp</span>
            <span>${cleaningFee}</span>
          </div>
          <div className="flex justify-between py-2 border-t mt-4 font-semibold">
            <span>Tổng tiền</span>
            <span>${finalTotal}</span>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-gray-500 text-sm">
        Bạn vẫn chưa bị trừ tiền
      </div>
    </div>
  );
}

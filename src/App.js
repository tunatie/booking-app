import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './UserContext';
import Layout from './components/Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import PropertiesPage from './pages/PropertiesPage';

export default function App() {
    return (
        <UserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<IndexPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/account/properties" element={<PropertiesPage />} />
                        <Route path="/account/properties/new" element={<PlacesFormPage />} />
                        <Route path="/account/properties/:id" element={<PlacesFormPage />} />
                        <Route path="/place/:id" element={<PlacePage />} />
                        <Route path="/account/bookings" element={<BookingsPage />} />
                        <Route path="/account/bookings/:id" element={<BookingPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserContextProvider>
    );
} 
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Layout from './Layout.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import PlacesFormPage from './pages/PlacesFormPage.jsx'
import PlacePage from './pages/PlacePage.jsx'
import PlaceEditPage from './pages/PlaceEditPage.jsx'
import BookingsPage from './pages/BookingsPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import HostLayout from './HostLayout.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import StructurePage from './pages/StructurePage.jsx'
import PrivacyTypePage from './pages/PrivacyTypePage.jsx'
import LocationPage from './pages/LocationPage.jsx'
import FloorPlanPage from './pages/FloorPlanPage.jsx'
import StandOutPage from './pages/StandOutPage.jsx'
import AmenitiesPage from './pages/AmenitiesPage.jsx'
import PhotosPage from './pages/PhotosPage.jsx'
import TitlePage from './pages/TitlePage.jsx'
import DescriptionPage from './pages/DescriptionPage.jsx'
import FinishPage from './pages/FinishPage.jsx'
import BookingSettingsPage from './pages/BookingSettingsPage.jsx'
import GuestTypePage from './pages/GuestTypePage.jsx'
import PricePage from './pages/PricePage.jsx'
import DiscountPage from './pages/DiscountPage.jsx'
import SecurityPage from './pages/SecurityPage.jsx'
import ReceiptPage from './pages/ReceiptPage.jsx'
import CelebrationPage from './pages/CelebrationPage.jsx'
import Messages from './components/Messages'
import Trips from './components/Trips'
import Wishlist from './components/Wishlist'
import HostExperience from './components/HostExperience'
import BecomeHost from './components/BecomeHost'
import HostingPage from './pages/HostingPage'
import ProfilePage from './pages/ProfilePage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import PersonalInfoPage from './pages/PersonalInfoPage'
import ListingsPage from './pages/ListingsPage'
import ReservationsPage from './pages/ReservationsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/bookings" element={<BookingsPage />} />
        <Route path="/account/bookings/:id" element={<BookingPage />} />
        <Route path="/place/:id" element={<PlacePage />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/host-experience" element={<HostExperience />} />
        <Route path="/become-host" element={<BecomeHost />} />
      </Route>
      <Route element={<HostLayout />}>
        <Route path="/account/hosting" element={<HostingPage />} />
        <Route path="/account/hosting/listings" element={<ListingsPage />} />
        <Route path="/account/hosting/reservations" element={<ReservationsPage />} />
        <Route path="/account/hosting/overview" element={<OverviewPage />} />
        <Route path="/account/hosting/new" element={<PlacesFormPage />} />
        <Route path="/account/hosting/structure" element={<StructurePage />} />
        <Route path="/account/hosting/privacy-type" element={<PrivacyTypePage />} />
        <Route path="/account/hosting/location" element={<LocationPage />} />
        <Route path="/account/hosting/floor-plan" element={<FloorPlanPage />} />
        <Route path="/account/hosting/stand-out" element={<StandOutPage />} />
        <Route path="/account/hosting/amenities" element={<AmenitiesPage />} />
        <Route path="/account/hosting/photos" element={<PhotosPage />} />
        <Route path="/account/hosting/title" element={<TitlePage />} />
        <Route path="/account/hosting/description" element={<DescriptionPage />} />
        <Route path="/account/hosting/finish" element={<FinishPage />} />
        <Route path="/account/hosting/booking-settings" element={<BookingSettingsPage />} />
        <Route path="/account/hosting/guest-type" element={<GuestTypePage />} />
        <Route path="/account/hosting/price" element={<PricePage />} />
        <Route path="/account/hosting/discount" element={<DiscountPage />} />
        <Route path="/account/hosting/security" element={<SecurityPage />} />
        <Route path="/account/hosting/receipt" element={<ReceiptPage />} />
        <Route path="/account/hosting/celebration" element={<CelebrationPage />} />
        <Route path="/account/hosting/:id" element={<PlaceEditPage />} />
        <Route path="/users/show/:id" element={<ProfilePage />} />
        <Route path="/account-settings" element={<AccountSettingsPage />} />
        <Route path="/account-settings/personal-info" element={<PersonalInfoPage />} />
      </Route>
    </Routes>
  )
}

export default App


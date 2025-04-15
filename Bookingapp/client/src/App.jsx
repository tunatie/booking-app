import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/AccountPage.jsx'
import Layout from './Layout.jsx'
import HostLayout from './HostLayout.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { UserContextProvider } from './UserContext.jsx'
import PlacesPage from './pages/PlacesPage.jsx'
import PlacesFormPage from './pages/PlacesFormPage.jsx'
import PlacePage from './pages/PlacePage.jsx'
import BookingsPage from './pages/BookingsPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import StructurePage from './pages/StructurePage.jsx'
import PrivacyTypePage from './pages/PrivacyTypePage.jsx'
import LocationPage from './pages/LocationPage'
import FloorPlanPage from './pages/FloorPlanPage'
import StandOutPage from './pages/StandOutPage'
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;


function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<IndexPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/account/" element={<ProfilePage/>}/>
          <Route path="/account/places" element={<PlacesPage/>}/>
          <Route path="/account/bookings" element={<BookingsPage/>}/>
          <Route path="/account/bookings/:id" element={<BookingPage/>}/>
          <Route path="/place/:id" element={<PlacePage/>}/>
        </Route>
        <Route path="/account/places" element={<HostLayout/>}>
          <Route path="structure" element={<StructurePage/>}/>
          <Route path="privacy-type" element={<PrivacyTypePage/>}/>
          <Route path="location" element={<LocationPage />} />
          <Route path="floor-plan" element={<FloorPlanPage />} />
          <Route path="stand-out" element={<StandOutPage />} />
          <Route path="new" element={<PlacesFormPage/>}/>
          <Route path=":id" element={<PlacesFormPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App


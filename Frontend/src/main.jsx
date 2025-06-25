import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import RateCalculator from './components/RateCalculator.jsx';
import RateDisplay from './components/RateDisplay.jsx';
import ScheduleaShip from './components/ScheduleaShip.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import CustomerDashboard from './components/CustomerDashboard.jsx';
import CustomerShipments from './components/CustomerShipments.jsx';
import TrackShipment from './components/TrackShipment.jsx';
import ReprintShippingLabel from './components/ReprintShippingLabel.jsx';
import CustomerProfile from './components/CustomerProfile.jsx';
import CustomerWallet from './components/CustomerWallet.jsx';
import RiderDashboard from './components/RiderDashboard.jsx';
import RiderProfile from './components/RiderProfile.jsx';
import RiderWallet from './components/RiderWallet.jsx';
import RiderShipments from './components/RiderShipments.jsx'
import RiderSignup from './components/RiderSignup.jsx';
import RiderLogin from './components/RiderLogin.jsx';
import CustomerReprintShippingLabel from './components/CustomerReprintShippingLabel.jsx'
import CustomerRateCalculator from './components/CustomerRateCalculator.jsx';
import CustomerRateDisplay from './components/CustomerRateDisplay.jsx';
import CustomerScheduleShip from './components/CustomerScheduleShip.jsx';
import CustomerTrackShipment from './components/CustomerTrackShipment.jsx';
import LiveTrack from './components/LiveTrack.jsx';
import SuccessfulPayment from './components/SuccessfulPayment.jsx';
import AdminSignup from './components/AdminSignup.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminProfile from './components/AdminProfile.jsx';
import AdminShipments from './components/AdminShipments.jsx';
import AdminRateCalculator from './components/AdminRateCalculator.jsx';
import AdminRateDisplay from './components/AdminRateDisplay.jsx';
import AdminScheduleShip from './components/AdminScheduleship.jsx';
import AdminReprintShippingLabel from './components/AdminReprintShippingLabel.jsx';
import AdminPayment from './components/AdminPayment.jsx';
import AdminTrackShipment from './components/AdminTrackShipment.jsx';
import InsurancePolicy from './components/InsurancePolicy.jsx';
import PaymentMethods from './components/PaymentMethod.jsx';
import FreelanceRiderProgram from './components/FreelanceRiderProgram.jsx';
import FileClaim from './components/FileClaim.jsx';
import AdminInsurance from './components/AdminInsurance.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import AdminRider from './components/AdminRider.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path:'/live-track',
    element:<LiveTrack />
  },
  {
    path:"/rate-calculator",
    element:<RateCalculator />
  },
  {
    path:"/price-page",
    element:<RateDisplay />
  },
  {
    path:"/schedule-a-ship",
    element:<ScheduleaShip />
  },
  {
    path:'/login',
    element:<Login />
  },
  {
    path:'/signup',
    element:<Signup />
  },
  {
    path:'/customer-dashboard',
    element:<CustomerDashboard />
  },
  {
    path:'customer-shipments',
    element:<CustomerShipments />
  },
  {
    path:'/track-shipment',
    element: <TrackShipment />
  },
  {
    path:'/reprint-shipping-label',
    element: <ReprintShippingLabel />
  },
  {
    path:'/customer-profile',
    element:<CustomerProfile />
  },
  {
    path:'/wallet',
    element:<CustomerWallet />
  },
  {
    path:'/rider-profile',
    element:<RiderProfile />
  },
  {
    path:'/rider-dashboard',
    element:<RiderDashboard />
  },
  {
    path:'/rider-wallet',
    element:<RiderWallet />
  },
  {
    path:'/rider-shipments',
    element:<RiderShipments />
  },
  {
    path:'/rider-dashboard',
    element:<RiderDashboard />
  },
  {
    path:'/rider-login',
    element:<RiderLogin />
  },
  {
    path:'/rider-signup',
    element:<RiderSignup />
  },
  {
    path:'/customer-reprintlabel',
    element:<CustomerReprintShippingLabel />
  },
  {
    path:'/customer-ratecalculator',
    element:<CustomerRateCalculator />
  },
  {
    path:'/customer-price-page',
    element:<CustomerRateDisplay />
  },
  {
    path:'/customer-scheduleship',
    element:<CustomerScheduleShip />
  },
  {
    path:'/customer-trackingshipment',
    element:<CustomerTrackShipment />
  },
  {
    path:'/payment-completed',
    element:<SuccessfulPayment />
  },
  {
    path:'/admin-signup',
    element:<AdminSignup />
  },
  {
    path:'/admin-login',
    element:<AdminLogin />
  },
  {
    path:'/admin-dashboard',
    element:<AdminDashboard />
  },
  {
    path:'/admin-profile',
    element:<AdminProfile />
  },
  {
    path:'/admin-shipments',
    element:<AdminShipments />
  },
  {
    path:'/admin-ratecalculator',
    element:<AdminRateCalculator />
  },
  {
    path:'/admin-price-page',
    element:<AdminRateDisplay />
  },
  {
    path:'/admin-scheduleship',
    element:<AdminScheduleShip />
  },
  {
    path:'/admin-reprintlabel',
    element:<AdminReprintShippingLabel />
  },
  {
    path:'/admin-payment',
    element:<AdminPayment />
  },
  {
    path:'/admin-trackingshipment',
    element: <AdminTrackShipment />
  },
  {
    path:'/insurane-policy',
    element: <InsurancePolicy />
  },
  {
    path:'/payment-methods',
    element: <PaymentMethods />
  },
  {
    path:'/freelance-rider-program',
    element: <FreelanceRiderProgram />
  },
  {
    path:'/file-claim',
    element: <FileClaim />
  },
  {
    path:'/admin-insurance',
    element: <AdminInsurance />
  },
  {
    path:'/reset',
    element: <ForgotPassword />
  },
  {
    path:'/admin-rider',
    element: <AdminRider />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
      
    </RouterProvider>
  </StrictMode>,
)

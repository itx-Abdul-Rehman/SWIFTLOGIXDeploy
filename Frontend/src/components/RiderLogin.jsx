import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx'
import image from './icons/login.png'
import show from './icons/view.png'
import hide from './icons/hide.png'
import tick from './icons/tick.svg'
import RiderOTPCard from './RiderOTPCard.jsx'
import SwiftBot from './SwiftBot.jsx';
import OfflineOnline from './OfflineOnline.jsx';
import FadeInSection from './FadeInSection.jsx';
import { FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isResponse, setIsResponse] = useState('idle')
  const [showChangeNotification, setShowChangeNotification] = useState(
    location.state?.isChange || false
  );
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [currentUser, setCurrentUser] = useState({
    userId: '',
    name: '',
    email: '',
    mobileno: ''
  })
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [otpCard, setOTPCard] = useState(false);
  const [otpVerified, setOTPVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value
    })
  }

  useEffect(() => {
    setTimeout(() => {
      setShowChangeNotification(false)
    }, 3000);
  }, [])



  const waitForSecond = () => {
    setTimeout(() => {
      navigate('/rider-dashboard');
    }, 1000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsResponse('processing')
    // Handle actual login logic here
    const response = await fetch('http://localhost:3000/rider-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginForm)
    });

    if (!response.ok) {
      console.log('response error');

    }

    const result = await response.json();
    console.log(result);
    if (result.success && result.verification === 'VERIFIED') {
      setIsResponse('success')
      setIsLogged(true);
      waitForSecond()
    } else if (result.success && result.verification === 'PENDING') {
      setCurrentUser(prevState => ({
        ...prevState,
        userId: result.data._id,
        name: result.data.name,
        email: result.data.email,
        mobileno: result.data.mobileno
      }));
      setOTPCard(true);
    } else {
      setIsResponse('idle')
      setError(result.message);
    }

  };

  const handleNavigateToDashBoard = () => {
    navigate('/rider-dashboard');
  };


  return (
    <>
      <Navbar />
      <OfflineOnline />
      <FadeInSection delay={0.2} >
        <div className='w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8'>
          <div className='text-3xl sm:text-5xl font-semibold text-center'>Rider Portal</div>
        </div>


        <div className="flex justify-center items-center w-full">
          {/* hidden not used  */}
          <div className="hidden left w-[50%]  justify-center items-center ">

            <div className="bg-[#FF7043] w-[70%] h-[80%] rounded-[60px] flex flex-col pt-4 justify-around items-center relative text-white ">

              <div className='text-6xl'>WELCOME!</div>

              <div className='className=' absolute bottom-0 >
                <img src={image} alt="Logo" />
              </div>
            </div>
          </div>

          <div className="right w-full lg:w-1/2 flex justify-center items-center transition-all duration-500 ease-in-out transform">
            <div className="w-[80%] lg:max-w-[400px] p-8 bg-white rounded-[10px] mt-10 shadow-lg">
              <h2 className="text-3xl text-gray-700 text-center mb-6">Login</h2>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <form onSubmit={handleSubmit} >
                {/* Email Field */}
                <div className="mb-4">
                  <input
                    type="email"
                    name='email'
                    value={loginForm.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:outline-none"
                    placeholder="Email Address"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="mb-4 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={loginForm.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:outline-none"
                    placeholder="Password"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <img src={show} alt='Show' className='w-6'></img> : <img src={hide} alt='Hide' className='w-6'></img>}
                  </span>
                </div>

                {/* Forgot Password Link */}
                <div className="mb-4 text-right">
                  <NavLink to={'/reset'}><div className="text-[#FF7043] text-sm">Forgot Password?</div></NavLink>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isResponse === 'processing'}
                  className="w-full bg-[#009688] hover:bg-[#FF7043] text-white py-3 rounded-md mb-4 transition-all duration-300"
                >
                  <AnimatePresence>
                    {isResponse === "success" && (
                      <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-[50%]"
                      >
                        <FaCheck className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>


                  <AnimatePresence>
                    {isResponse === "processing" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="absolute right-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  <span className="ml-6">
                    {isResponse === "processing" ? "Processing..." : isResponse === "success" ? "" : "Signin"}
                  </span>
                </button>


                {/* Signup Link */}
                <p className="text-center text-sm">
                  Don't have an account?{' '}
                  {/* Change routing address after */}
                  <NavLink to='/rider-signup'>
                    <a href="#" className="text-[#FF7043]">Signup</a>
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </FadeInSection>

      {showChangeNotification &&
        <div className='border-none bg-[#009688] text-white w-60 p-4 absolute bottom-8 right-4  bg-opacity-3 backdrop-blur-lg '>
          New password created
        </div>
      }

      {/* Login successfully card */}

      {isLogged && (
        <div className='w-full flex justify-center items-center fixed top-0 left-0 h-screen bg-black bg-opacity-50 z-50'>
          <div className='w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] rounded-3xl shadow-2xl bg-white p-5 flex flex-col items-center relative transition-all duration-300'>
            <img src={tick} alt="Success" className='w-20   shadow-2xl rounded-full absolute -top-9' />
            <p className='mt-10  text-center text-xl sm:text-[36px] text-gray-700 font-semibold'>
              You are successfully logged in!
            </p>
          </div>
        </div>
      )}

      {/* OTP Card */}
      {otpVerified && (
        <div className="w-full flex justify-center absolute top-[50%]">
          <div className="w-auto rounded-3xl shadow-2xl flex justify-center items-center flex-col p-5 relative bg-white transition-all duration-300">
            <img src={tick} alt="Success" className="w-20 shadow-2xl rounded-full absolute top-[-36px]" />
            <p className="mt-16 text-gray-700 text-[24px] font-semibold text-center">Your application has been successfully submitted.</p>
            <p className="text-gray-700 text-[24px] font-semibold text-center">We will review it, and your account will be activated within 24 hours.</p>
          </div>
        </div>
      )}


      <SwiftBot />

      {/* OTP CARD */}
      {otpCard && <RiderOTPCard email={currentUser.email} userId={currentUser.userId} setOTPCard={setOTPCard} setOTPVerified={setOTPVerified} navigate={handleNavigateToDashBoard} />}
    </>
  );
};

export default Login;
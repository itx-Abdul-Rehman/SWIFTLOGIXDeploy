import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx'
import image from './icons/login.png'
import show from './icons/view.png'
import hide from './icons/hide.png'
import tick from './icons/tick.svg'
import OTPCard from './OTPCard.jsx';
import SwiftBot from './SwiftBot.jsx';
import OfflineOnline from './OfflineOnline.jsx';
import FadeInSection from './FadeInSection.jsx';
import { FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const location = useLocation();
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


  useEffect(() => {
    setTimeout(() => {
      setShowChangeNotification(false)
    }, 3000);
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value
    })
  }

  const waitForSecond = () => {
    setTimeout(() => {
      navigate('/customer-dashboard',

      );
    }, 1000);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("processing");
    setError('');
    // Handle actual login logic here
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginForm)
    });

    if (!response.ok) {
      console.log('response error');

    }

    const result = await response.json();

    if (result.success && result.verification === 'VERIFIED') {
      setIsLogged(true);
      setStatus("success");
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
      setStatus("idle");
      setError(result.message);
    }



  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/customer-dashboard`,
          { credentials: 'include' }
        );
        const result = await response.json();

        if (result.success) {
          navigate('/customer-dashboard');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (

    <>
      <Navbar />
      <OfflineOnline />
      <FadeInSection delay={0.2} >
        {/* Header */}
        <div className='w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8'>
          <div className='text-3xl sm:text-5xl font-semibold text-center'>Customer Portal</div>
        </div>

        {/* Main Section */}
        <div className="flex flex-col lg:flex-row justify-center items-center w-full max-[1025px]:mt-10  max-h-screen overflow-hidden px-4 sm:px-6 lg:px-12 py-8 gap-8">

          {/* Left Panel -- hidden not used */}
          <div className="hidden  w-full lg:w-1/2 h-[50vh] lg:h-screen justify-center items-center">
            <div className="bg-[#FF7043] w-[90%] sm:w-[70%] h-[90%] sm:h-[80%] rounded-[40px] sm:rounded-[60px] flex flex-col justify-between items-center pt-4 text-white relative">
              <div className='text-3xl sm:text-6xl mt-5'>WELCOME!</div>

              <div className="absolute bottom-4 sm:bottom-6">
                <img
                  src={image}
                  alt="Logo"
                  className='w-32 sm:w-40 md:w-52 lg:w-64 max-w-full h-auto object-contain'
                />
              </div>
            </div>
          </div>

          {/* Right Panel (Login) */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="w-full lg:max-w-[400px] p-6 sm:p-8 bg-white rounded-[10px] shadow-lg">
              <h2 className="text-2xl sm:text-3xl text-gray-700 text-center mb-6">Sign In</h2>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <form onSubmit={handleSubmit}>
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
                    {showPassword ?
                      <img src={show} alt='Show' className='w-6' />
                      :
                      <img src={hide} alt='Hide' className='w-6' />
                    }
                  </span>
                </div>

                {/* Forgot Password */}
                <div className="mb-4 text-right">
                  <NavLink to={`/reset`}> <div className="text-[#FF7043] text-sm cursor-pointer">Forgot Password?</div></NavLink>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={status === "processing"}
                  className="w-full bg-[#009688] hover:bg-[#FF7043] text-white py-3 rounded-md mb-4 transition-all duration-300"
                >
                  <AnimatePresence>
                    {status === "success" && (
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
                    {status === "processing" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="absolute right-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    )}
                  </AnimatePresence>

                  {/* Button Text */}
                  <span className="ml-6">
                    {status === "processing" ? "Processing..." : status === "success" ? "" : "Signin"}
                  </span>
                </button>

                {/* Signup */}
                <p className="text-center text-sm">
                  Don't have an account?{' '}
                  <NavLink to='/signup' className="text-[#FF7043]">Signup</NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Success Card */}
      {(isLogged || otpVerified) && (
        <div className='w-full flex justify-center items-center fixed top-0 left-0 h-screen bg-black bg-opacity-50 z-50'>
          <div className='w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] rounded-3xl shadow-2xl bg-white p-5 flex flex-col items-center relative transition-all duration-300'>
            <img src={tick} alt="Success" className='w-20   shadow-2xl rounded-full absolute -top-9' />
            <p className='mt-10  text-center text-xl sm:text-[36px] text-gray-700 font-semibold'>
              You are successfully logged in!
            </p>
          </div>
        </div>
      )}

      {showChangeNotification &&
        <div className='border-none bg-[#009688] text-white w-60 p-4 absolute bottom-8 right-4  bg-opacity-3 backdrop-blur-lg '>
          New password created
        </div>
      }

      <SwiftBot />

      {/* OTP Card */}
      {otpCard && (
        <OTPCard
          email={currentUser.email}
          userId={currentUser.userId}
          setOTPCard={setOTPCard}
          setOTPVerified={setOTPVerified}
        />
      )}
    </>

  );


};

export default Login;
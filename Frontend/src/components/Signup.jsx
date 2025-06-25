import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx'
import image from './icons/login.png'
import show from './icons/view.png'
import hide from './icons/hide.png'
import OTPCard from './OTPCard.jsx';
import tick from './icons/tick.svg'
import SwiftBot from './SwiftBot.jsx';
import OfflineOnline from './OfflineOnline.jsx';
import FadeInSection from './FadeInSection.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const Signup = () => {
    const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState({
        name: '',
        email: '',
        mobileno: '',
        password: '',
        confirmpassword: ''
    })
    const [status, setStatus] = useState("idle");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [otpCard, setOTPCard] = useState(false);
    const [otpVerified, setOTPVerified] = useState(false);

    const [currentUser, setCurrentUser] = useState({
        userId: '',
        name: '',
        email: '',
        mobileno: ''
    })


    const handleChange = (e) => {
        const { name, value } = e.target
        setSignupForm({
            ...signupForm,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Password length match
        if (signupForm.password.length < 8) {
            setError('Password contain minimum 8 characters');
            return;
        }
        // Password match with confirm password
        if (signupForm.password !== signupForm.confirmpassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        // Handle actual signup logic here

        try {
            setStatus('processing')
            const response = await fetch('http://13.203.194.4:3000/signup',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(signupForm)
                }
            )

            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json()
            if (result.success) {
                setCurrentUser(prevState => ({
                    ...prevState,
                    userId: result.data._id,
                    name: result.data.name,
                    email: result.data.email,
                    mobileno: result.data.mobileno
                }));
                setStatus('success')
                setOTPCard(true);
            } else {
                setStatus('idle')
                setError(result.message);
            }



        } catch (error) {
            console.error('Error submitting form:', error);
        }

    };



    const handleNavigateToDashBoard = () => {
        navigate('/customer-dashboard');
    }


    return (

        <>
            <Navbar />
            <OfflineOnline />
            <FadeInSection delay={0.2}>
                <div className='w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8'>
                    <div className='text-3xl sm:text-5xl font-semibold text-center'>Customer Portal</div>
                </div>

                <div className="flex justify-center mt-2 w-full ">
                    <div className="left w-full lg:w-1/2   flex justify-center  ">
                        {/*  */}
                        <div className="w-full lg:max-w-[400px] p-8 bg-white rounded-[10px] shadow-lg ">
                            <h2 className="text-3xl text-gray-700 text-center mb-6 ">Sign Up</h2>
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                            <form onSubmit={handleSubmit}>
                                {/* Name Field */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={signupForm.name}
                                        name='name'
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none"
                                        placeholder="Name"
                                        required

                                    />
                                </div>

                                {/* Email Field */}
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        value={signupForm.email}
                                        name='email'
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none"
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>
                                {/* Mobile no Field */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={signupForm.mobileno}
                                        name='mobileno'
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none"
                                        placeholder="Mobile No"
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="mb-4 relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={signupForm.password}
                                        name='password'
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

                                {/* Confirm Password Field */}
                                <div className="mb-4 relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={signupForm.confirmpassword}
                                        name='confirmpassword'
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none"
                                        placeholder="Confirm Password"
                                        required
                                    />
                                    <span
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <img src={show} alt='Show' className='w-6'></img> : <img src={hide} alt='Hide' className='w-6'></img>}
                                    </span>
                                </div>

                                {/* Sign Up Button */}
                                <button
                                    type="submit"
                                    className="relative w-full bg-[#009688] hover:bg-[#FF7043] text-white py-3 rounded-md mb-4 transition-all duration-300"
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

                                    <AnimatePresence >
                                        {status === "processing" && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1, rotate: 360 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="absolute right-4 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        )}
                                    </AnimatePresence>

                                    {/* Button Text */}
                                    <span className="ml-6">
                                        {status === "processing" ? "Processing..." : status === "success" ? " " : "Signup"}
                                    </span>

                                </button>


                                {/* Login Link */}
                                <p className="text-center text-sm">
                                    Already have an account?{' '}
                                    <NavLink to='/login'>
                                        <a href="/login" className="text-[#FF7043]">Signin</a>
                                    </NavLink>
                                </p>
                            </form>
                        </div>
                    </div>

                    <div className="hidden right w-[50%] h-[100%]  justify-center items-center">
                        <div className="bg-[#FF7043] w-[70%] h-[80%] rounded-[60px] flex flex-col pt-4 justify-around items-center relative text-white ">

                            <div className='text-6xl'>WELCOME!</div>

                            <div className='className=' absolute bottom-0 >
                                <img src={image} alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </FadeInSection>

            {/* Login successfully card */}

            {otpVerified && (
                <div className='w-full flex justify-center absolute top-[50%]'>
                    <div className='w-[30%]  rounded-3xl shadow-2xl flex justify-center items-center flex-col p-5 relative bg-white transition-all duration-300'>
                        <img src={tick} alt="Success" className='w-20 shadow-2xl rounded-full absolute top-[-36px]' />
                        <p className='mt-16 text-gray-700 text-[44px] font-semibold text-center'>You are successfully Signed up!</p>
                    </div>
                </div>
            )}

            <SwiftBot />

            {/* OTP CARD */}
            {otpCard && <OTPCard email={currentUser.email} userId={currentUser.userId} setOTPCard={setOTPCard} setOTPVerified={setOTPVerified} navigate={handleNavigateToDashBoard} />}

        </>

    );
};

export default Signup;
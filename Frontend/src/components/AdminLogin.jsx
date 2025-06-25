import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import image from './icons/login.png'
import show from './icons/view.png'
import hide from './icons/hide.png'
import tick from './icons/tick.svg'
import logo from './logo/SWIFTLOGIX Logo 2.png';
import OTPCard from './OTPCard.jsx';
import OfflineOnline from './OfflineOnline.jsx';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });
    const [currentUser, setCurrentUser] = useState({
        userId: '',
        name: '',
        email: '',
    })
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLogged, setIsLogged] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value
        })
    }

    const waitForSecond = () => {
        setTimeout(() => {
            navigate('/admin-dashboard',
            );
        }, 1000);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        // Handle actual login logic here
        const response = await fetch('http://13.203.194.4:3000/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginForm)
        });

        if (!response.ok) {
            console.log('response error');

        }

        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('token', result.token);
            setIsLogged(true);
            waitForSecond()
        } else {
            setError(result.message);
        }

    };



    return (
        <>
        <OfflineOnline />
            {/* Header */}
            <div className="w-full flex justify-center items-center">
                <div className="flex flex-col items-center text-center">
                    <img src={logo} alt="SwiftLogix Logo" className="w-14 py-2 object-contain" />
                </div>
            </div>


            <div className='w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8'>
                <div className='text-3xl sm:text-5xl font-semibold text-center'>Admin Portal</div>
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
                                    {showPassword ? (
                                        <img src={show} alt='Show' className='w-6' />
                                    ) : (
                                        <img src={hide} alt='Hide' className='w-6' />
                                    )}
                                </span>
                            </div>

                            {/* Forgot Password */}
                            <div className="mb-4 text-right">
                                <a href="#" className="text-[#FF7043] text-sm">Forgot Password?</a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#009688] hover:bg-[#FF7043] text-white py-3 rounded-md mb-4 transition-all duration-300"
                            >
                                Login
                            </button>

                            {/* Signup */}
                            <p className="text-center text-sm">
                                Don't have an account?{' '}
                                <NavLink to='/admin-signup' className="text-[#FF7043]">Signup</NavLink>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Card */}
            {isLogged && (
                <div className='w-full flex justify-center items-center fixed top-0 left-0 h-screen bg-black bg-opacity-50 z-50'>
                    <div className='w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] rounded-3xl shadow-2xl bg-white p-5 flex flex-col items-center relative transition-all duration-300'>
                        <img src={tick} alt="Success" className='w-20   shadow-2xl rounded-full absolute -top-9' />
                        <p className='mt-10   text-center text-xl sm:text-[36px] text-gray-700 font-semibold'>
                            You are successfully logged in.
                        </p>
                    </div>
                </div>
            )}

        </>
    );


};

export default AdminLogin;
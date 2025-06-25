import { NavLink, useNavigate } from "react-router-dom";
import { FaBiking, FaUser } from "react-icons/fa";
import { useState } from "react";
import Footer from "./Footer";
import OTPCardForgotPassword from "./OTPCardForgotPassword";
import tick from './icons/tick.svg';
import show from './icons/view.png'
import hide from './icons/hide.png'
import SwiftBot from "./SwiftBot";
import OfflineOnline from "./OfflineOnline";
import logo from './logo/SWIFTLOGIX Logo 2.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [otpCard, setOTPCard] = useState(false);
    const [otpVerified, setOTPVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [type, setType] = useState(null)
    const [isPasswordCreated, setIsPasswordCreated] = useState(false)
    const [isResponse, setIsResponse] = useState('idle')

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError('')
    };
    const handleChangeType = (e) => {
        setType(e.target.value);
    };

    const handleChangePassword = (e) => {
        setError('')
        setPassword(e.target.value)
    }

    const handleChangeConfirmPassword = (e) => {
        setError('')
        setConfirmPassword(e.target.value)
    }

    const handleSendOTP = async () => {
        try {
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                setError('Please enter a valid email address')
                return
            }

            if (type === null) {
                setError('Who are you?')
                return
            }

            setError('')
            setIsResponse('processing')
            const response = await fetch('http://localhost:3000/send-otp-forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, type })
            });

            if (!response.ok) {
                setError('Failed to send OTP. Please check your email and try again.');
                return;
            }

            const result = await response.json();
            if (result.success) {
                setIsResponse('idle')
                setUserId(result.userId);
                setOTPCard(true);
            } else {
                setIsResponse('idle')
                setError(result.message);
            }
        } catch (error) {
            setError("Failed to send OTP. Please try again.");
        }
    };


    const handleSubmitPassword = async () => {
        try {
            if (password.length < 8) {
                setError('Password contain minimum 8 characters')
                return
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match')
                return
            }
            setIsResponse('processing')
            const response = await fetch('http://localhost:3000/create-new-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        password: password,
                        confirmPassword: confirmPassword,
                        type: type,
                        email: email,
                    })
            });

            if (!response.ok) {
                setError('Failed to create new password. Try again.');
                return;
            }

            const result = await response.json();
            if (result.success) {
                setIsResponse('success')
                if (type === 'rider') {
                    navigate('/rider-login', {
                        state: { isChange: true }
                    });

                } else if (type === 'customer') {
                    navigate('/login', {
                        state: { isChange: true }
                    });

                }
            } else {
                setIsResponse('idle')
                setError(result.message);
            }


        } catch (error) {
            setError('Failed to create new password. Try again.');
        }
    }

    return (
        <>
            <SwiftBot />
            <OfflineOnline />
            <div className="h-screen flex flex-col">
                {/* Top Bar */}
                <div className="w-full flex justify-around items-center border-b py-2">
                    <div>
                        <img src={logo} alt="SwiftLogix Logo" className="w-14 py-2 object-contain" />
                    </div>
                    <div className="flex gap-4">
                        <NavLink to="/rider-login">
                            <li className='flex gap-1 items-center hover:bg-[#009688] p-2 rounded-lg hover:text-[#F7F7F7]'>
                                <FaBiking size={24} color='#FF7043' />
                                <span>Become a Rider</span>
                            </li>
                        </NavLink>
                        <NavLink to="/login">
                            <li className='flex gap-1 items-center hover:bg-[#009688] p-2 rounded-lg hover:text-[#F7F7F7]'>
                                <FaUser size={18} color='#FF7043' />
                                <span>Become a Customer</span>
                            </li>
                        </NavLink>
                    </div>
                </div>

                {/* Centered Form Area */}
                <div className="flex flex-1 justify-center items-center">
                    <div className="w-full max-w-[400px] p-6 sm:p-8 bg-white rounded-[10px] shadow-lg">
                        {
                            otpVerified ? <h2 className="text-2xl sm:text-3xl text-gray-700 text-center mb-6">Create a new password</h2>
                                :
                                <h2 className="text-2xl sm:text-3xl text-gray-700 text-center mb-6">Trouble with logging in?</h2>
                        }

                        {!otpVerified && <div className="mb-3">Enter your email address, and we'll send you an OTP to get back into your account.</div>}

                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                        <form>
                            {!otpVerified &&
                                <>
                                    <div className="mb-4">
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={handleChange}
                                            className="w-full p-3 border rounded-md focus:outline-none"
                                            placeholder="Email Address"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">

                                        <select name="type" id="type" value={type} onChange={handleChangeType} required>
                                            <option value="" disabled selected>Who are you?</option>
                                            <option value="rider" >Rider</option>
                                            <option value="customer">Customer</option>
                                        </select>
                                    </div>

                                    <button
                                        disabled={!email || isResponse === 'processing'}
                                        type="button"
                                        onClick={handleSendOTP}
                                        className={`w-full bg-[#009688] ${email && 'hover:bg-[#FF7043]'} text-white py-3 rounded-md transition-all duration-300`}
                                    >
                                        {isResponse === 'processing' ? 'Processing...' : isResponse === 'success' ? 'Sent' : 'Send OTP'}
                                    </button>
                                </>
                            }

                            {/* Password Field */}
                            {otpVerified &&
                                <>
                                    <div className="relative mb-4">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            name='password'
                                            onChange={handleChangePassword}
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
                                    <div className="relative mb-4">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            name='confirmpassword'
                                            onChange={handleChangeConfirmPassword}
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
                                    <button
                                        disabled={!password && !confirmPassword || isResponse === 'processing'}
                                        type="button"
                                        onClick={handleSubmitPassword}
                                        className={`w-full bg-[#009688] ${password && confirmPassword && 'hover:bg-[#FF7043]'} text-white  py-3 rounded-md transition-all duration-300`}
                                    >
                                        {isResponse === 'processing' ? 'Processing...' : isResponse === 'success' ? 'Changed' : 'Change'}
                                    </button>
                                </>
                            }


                        </form>
                    </div>
                </div>


                {/* Show OTP card only when triggered */}
                {otpCard && (
                    <OTPCardForgotPassword
                        email={email}
                        userId={userId}
                        setOTPCard={setOTPCard}
                        setOTPVerified={setOTPVerified}
                    />
                )}
            </div>

            <Footer />
        </>
    );
};

export default ForgotPassword;

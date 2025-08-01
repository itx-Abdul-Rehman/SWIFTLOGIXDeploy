import React, { useState, useEffect } from 'react';
import mail from './icons/mail.gif';

const OTPCard = ({ email, userId, setOTPCard, setOTPVerified, navigate }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true); 

  // Start the countdown when OTP is sent
  useEffect(() => {
    let interval;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    }

    // Cleanup interval when time runs out or component unmounts
    if (timeRemaining === 0) {
      setIsResendDisabled(false); // Enable the Resend OTP button when the timer hits 0
    }

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.match(/[0-9]/) && value.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index === 3) {
        setShowVerifyOTP(true);
      }

      if (index < 3) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    } else if (value === '') {
  
      const newOtp = [...otp];
      newOtp[index] = ''; 
      setOtp(newOtp);
      setShowVerifyOTP(false);

      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const otpCode = otp.join('');
    const otpJson = { otp: otpCode, userId: userId };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verifyotp`, {
        method: 'POST',
        credentials:'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpJson),
      });

      if (!response.ok) {
        console.log('response error');
      }

      const result = await response.json();
      if (result.success) {
        // Success logic here
        setOTPCard(false);
        setOTPVerified(true);
        navigate();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle OTP Resend
  const handleResendOtp = async () => {

    // Logic to resend OTP goes here (send request to your API to resend OTP)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/resendotp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, userId: userId })
        }
      )

      if (!response.ok) {
        console.log('response error');
        return
      }

      const result = await response.json();
      console.log(result)
      if (result.success) {
        setError(result.message)
        // Reset OTP state
        setOtp(['', '', '', '']);
        setShowVerifyOTP(false);
        setError('');
        setIsResendDisabled(true);
        setTimeRemaining(120);
      } else {
        setError(result.message)
      }


    } catch (error) {
      console.log(error)
    }


  };

  // Function to format seconds into mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-3xl shadow-md w-[50%] absolute top-[35%]">
        <div className="flex justify-center">
          <img src={mail} alt="mailicon" />
        </div>
        <h1 className="text-3xl font-semibold text-center text-gray-700 mt-4 mb-4">Verify Email</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="font-semibold text-center text-gray-700 mt-4 mb-6">
          Enter the OTP sent to <b>{email}</b>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-4 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                maxLength="1"
                className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded focus:outline-[#FF7043] focus:border-blue-500"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-4 mb-4">
            {timeRemaining == 0 && (
              <button
                type="button"
                className="py-2 px-3 border-2 rounded-2xl ${isResendDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}hover:bg-slate-100"
                disabled={isResendDisabled}
                onClick={handleResendOtp}
              >
                Resend
              </button>
            )}
            {timeRemaining > 0 && <p>{formatTime(timeRemaining)}</p>}
          </div>

          {/* Verify OTP Button */}
          {showVerifyOTP && (
            <button
              type="submit"
              className="w-full py-2 bg-[#009688] text-white font-semibold rounded-lg hover:bg-[#FF7043] transition"
            >
              Verify OTP
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default OTPCard;

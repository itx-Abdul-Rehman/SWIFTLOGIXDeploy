import React, { useState, useEffect } from 'react';
import mail from './icons/mail.gif';

const OTPCardForgotPassword = ({ email, userId, setOTPCard, setOTPVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.match(/[0-9]/) && value.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index === otp.length - 1) {
        setShowVerifyOTP(true);
      }

      if (index < otp.length - 1) {
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
    const otpPayload = { otp: otpCode, userId };

    try {
      const response = await fetch('http://13.234.75.47:3000/verifyotp-forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpPayload),
      });

      if (!response.ok) {
        setError('Failed to verify OTP. Please try again.');
        return;
      }

      const result = await response.json();
      if (result.success) {
        setOTPCard(false);
        setOTPVerified(true);
      } else {
        setError(result.message || 'OTP verification failed.');
      }
    } catch (error) {
      setError('OTP verification failed. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('http://13.234.75.47:3000/resendotp-forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userId }),
      });

      if (!response.ok) {
        setError('Failed to resend OTP.');
        return;
      }

      const result = await response.json();
      if (result.success) {
        setOtp(['', '', '', '']);
        setShowVerifyOTP(false);
        setError('');
        setIsResendDisabled(true);
        setTimeRemaining(120);
      } else {
        setError(result.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-3xl shadow-md w-[90%] max-w-[400px] absolute top-[35%]">
        <div className="flex justify-center">
          <img src={mail} alt="mail icon" className="w-24 h-24" />
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
                autoFocus={index === otp.findIndex((d) => d === '')}
              />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-4 mb-4">
            {timeRemaining === 0 ? (
              <button
                type="button"
                className={`py-2 px-4 border-2 rounded-2xl ${
                  isResendDisabled ? 'cursor-not-allowed bg-gray-200' : 'cursor-pointer hover:bg-slate-100'
                }`}
                disabled={isResendDisabled}
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-600">{formatTime(timeRemaining)}</p>
            )}
          </div>

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

export default OTPCardForgotPassword;

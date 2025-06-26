import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx'
import RiderInformation from './RiderInformation.jsx'
import VehicleInformation from './VehicleInformation.jsx';
import tick from './icons/tick.svg';
import RiderOTPCard from './RiderOTPCard.jsx';
import SwiftBot from './SwiftBot.jsx';
import OfflineOnline from './OfflineOnline.jsx';
import FadeInSection from './FadeInSection.jsx';


const RiderSignup = () => {
    const navigate = useNavigate();
    const [riderInformation, setRiderInformation] = useState({
        name: '',
        email: '',
        cnic: '',
        mobileno: '',
        password: '',
        confirmpassword: '',
        city: '',
        address: '',
        dateofbirth: '',
        picture: null
    })
    const [vehicleInformation, setVehicleInformation] = useState({
        vehicleType: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleNumberPlate: '',
        drivingLicenseFront: null,
        drivingLicenseBack: null,
        vehicleCardFront: null,
        vehicleCardBack: null,
        cnicFront: null,
        cnicBack: null
    })
    const [currentUser, setCurrentUser] = useState({
        userId: '',
        name: '',
        email: '',
        mobileno: '',
    })
    const [currentStep, setcurrentStep] = useState('riderinformation')
    const [error, setError] = useState('');
    const [otpCard, setOTPCard] = useState(false);
    const [otpVerified, setOTPVerified] = useState(false);

    const handleNext = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-riderdataexist`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ riderInformation })
                }
            )

            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json()

            if (result.success) {
                return setError(result.message);
            } else {
                return setcurrentStep('vehicleinformation')
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        }


    }


    const handleBack = () => {
        setcurrentStep('riderinformation')
    }

    const handleNavigateToDashBoard = () => {
        navigate('/rider-dashboard');
    };

    const handleSignup = async () => {

        try {
            const formData = new FormData();
            formData.append('vehicleType', vehicleInformation.vehicleType);
            formData.append('vehicleMake', vehicleInformation.vehicleMake);
            formData.append('vehicleModel', vehicleInformation.vehicleModel);
            formData.append('vehicleNumberPlate', vehicleInformation.vehicleNumberPlate);
            formData.append('drivingLicenseFront', vehicleInformation.drivingLicenseFront);
            formData.append('drivingLicenseBack', vehicleInformation.drivingLicenseBack);
            formData.append('vehicleCardFront', vehicleInformation.vehicleCardFront);
            formData.append('vehicleCardBack', vehicleInformation.vehicleCardBack);
            formData.append('cnicFront', vehicleInformation.cnicFront);
            formData.append('cnicBack', vehicleInformation.cnicBack);
            formData.append('name', riderInformation.name);
            formData.append('email', riderInformation.email);
            formData.append('cnic', riderInformation.cnic);
            formData.append('mobileno', riderInformation.mobileno);
            formData.append('password', riderInformation.password);
            formData.append('confirmpassword', riderInformation.confirmpassword);
            formData.append('city', riderInformation.city);
            formData.append('address', riderInformation.address);
            formData.append('dateofbirth', riderInformation.dateofbirth);
            formData.append('picture', riderInformation.picture);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/rider-signup`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
            )

            if (!response.ok) {
                console.log('response error');
            }

            const result = await response.json()

            if (result.success) {
                setCurrentUser(prevState => ({
                    ...prevState,
                    userId: result.riderData._id,
                    name: result.riderData.name,
                    email: result.riderData.email,
                    mobileno: result.riderData.mobileno
                }));
                setOTPCard(true);
            } else {
                setError(result.message);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        }

    }

    return (
        <>
            <Navbar />
            <SwiftBot />
            <OfflineOnline />

            <FadeInSection delay={0.2} >
                <div className='w-full bg-[#009688] text-white flex justify-center items-center p-8'>
                    <div className='text-5xl font-semibold'>Rider Portal</div>
                </div>
            </FadeInSection>


            {currentStep === 'riderinformation' ?
                <RiderInformation onNext={handleNext} riderInformation={riderInformation} setRiderInformation={setRiderInformation} error={error} setError={setError} />
                : <VehicleInformation onBack={handleBack} vehicleInformation={vehicleInformation} setVehicleInformation={setVehicleInformation} handleSignup={handleSignup} />}


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

            {/* OTP CARD */}
            {otpCard && <RiderOTPCard email={currentUser.email} userId={currentUser.userId} setOTPCard={setOTPCard} setOTPVerified={setOTPVerified} navigate={handleNavigateToDashBoard} />}

        </>
    );
};

export default RiderSignup;
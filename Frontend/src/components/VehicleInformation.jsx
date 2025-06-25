import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import image from './icons/login.png';
import FadeInSection from './FadeInSection';


const VehicleInformation = ({ onBack, vehicleInformation, setVehicleInformation, handleSignup }) => {

    const [error, setError] = useState('');
    const [isResponse, setIsResponse] = useState('idle')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleInformation({
            ...vehicleInformation,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setError('');
        const { name, files } = e.target;
        const file = files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 20 * 1024 * 1024; // 20 MB

        if (!validTypes.includes(file.type)) {
            setError('Only JPG, JPEG, or PNG files are allowed*');
            setVehicleInformation({
                ...vehicleInformation,
                [name]: null,
            });
            return;
        }

        if (file.size > maxSize) {
            setError('File size must be under 20MB*');
            setVehicleInformation({
                ...vehicleInformation,
                [name]: null,
            });
            return;
        }

        setVehicleInformation({
            ...vehicleInformation,
            [name]: file,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(vehicleInformation.drivingLicenseFront==null){
            setError('Driving License Front Side required*');
            return
        }
         if(vehicleInformation.drivingLicenseBack==null){
            setError('Driving License Back Side required*');
            return
        }
         if(vehicleInformation.vehicleCardFront==null){
            setError('Vehicle Card Front Side required*');
            return
        }
         if(vehicleInformation.vehicleCardBack==null){
            setError('Vehicle Card Back Side required*');
            return
        }
         if(vehicleInformation.cnicFront==null){
            setError('CNIC Front Side required*');
            return
        }
         if(vehicleInformation.cnicBack==null){
            setError('CNIC Back Side required*');
            return
        }
        
        setError('')
        setIsResponse('processing')
        handleSignup();
    };

    const handleBack = () => {
        onBack()
    }

    return (
        <>
            <FadeInSection delay={0.2}>
                <div className="flex justify-center  w-full">
                    <div className="left w-full md:w-1/2 mt-4  flex justify-center">
                        <div className="w-fullh-auto p-8 bg-white rounded-[10px] shadow-lg ">
                            <h2 className="text-3xl text-gray-700 text-center mb-6 ">Sign Up</h2>
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                            <form onSubmit={handleSubmit} >
                                {/* Vehicle Information Section */}
                                <h3 className="text-xl font-semibold mb-4 text-gray-700">Vehicle Information</h3>
                                <div className="mt-6">

                                    {/* Vehicle Type */}
                                    <div className='flex flex-around gap-8'>
                                        <div className='w-full'>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    value={vehicleInformation.vehicleType}
                                                    name="vehicleType"
                                                    onChange={handleChange}
                                                    className="w-full p-3 border rounded-md focus:outline-none"
                                                    placeholder="Vehicle Type"
                                                    required
                                                />
                                            </div>
                                            {/* Vehicle Make */}
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    value={vehicleInformation.vehicleMake}
                                                    name="vehicleMake"
                                                    onChange={handleChange}
                                                    className="w-full p-3 border rounded-md focus:outline-none"
                                                    placeholder="Vehicle Make"
                                                    required
                                                />
                                            </div>
                                            {/* Vehicle Model */}
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    value={vehicleInformation.vehicleModel}
                                                    name="vehicleModel"
                                                    onChange={handleChange}
                                                    className="w-full p-3 border rounded-md focus:outline-none"
                                                    placeholder="Vehicle Model"
                                                    required
                                                />
                                            </div>
                                            {/* Vehicle Number Plate */}
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    value={vehicleInformation.vehicleNumberPlate}
                                                    name="vehicleNumberPlate"
                                                    onChange={handleChange}
                                                    className="w-full p-3 border rounded-md focus:outline-none"
                                                    placeholder="Vehicle Number Plate"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            {/* Driving License Card Upload */}
                                            <div className="mb-4">
                                                <span className='text-gray-700 mb-2 font-semibold'>Driving License Front/Back:</span>
                                                <div className='flex gap-2'>
                                                    <input
                                                        type="file"
                                                        name="drivingLicenseFront"
                                                        onChange={handleFileChange}
                                                        className="w-full p-3 border rounded-md focus:outline-none"
                                                        required
                                                    />
                                                    <input
                                                        type="file"
                                                        name="drivingLicenseBack"
                                                        onChange={handleFileChange}
                                                        className="w-full p-3 border rounded-md focus:outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <span className='text-gray-700 mb-2 font-semibold'>Vehicle Card Front/Back:</span>
                                                <div className='flex gap-2'>
                                                    <input
                                                        type="file"
                                                        name="vehicleCardFront"
                                                        onChange={handleFileChange}
                                                        className="w-full p-3 border rounded-md focus:outline-none"
                                                        required
                                                    />
                                                    <input
                                                        type="file"
                                                        name="vehicleCardBack"
                                                        onChange={handleFileChange}
                                                        className="w-full p-3 border rounded-md focus:outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <span className='text-gray-700 mb-2 font-semibold'>CNIC Front/Back:</span>
                                                <div className='flex gap-2'>
                                                    <input
                                                        type="file"
                                                        name="cnicFront"
                                                        onChange={handleFileChange}
                                                        className="w-full p-3 border rounded-md focus:outline-none"
                                                        required
                                                    />
                                                    <input
                                                        type="file"
                                                        name="cnicBack"
                                                        onChange={handleFileChange}
                                                        className="w-full p-3 border rounded-md focus:outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sign Up Button */}
                                <div className='flex  justify-center gap-4'>
                                    <div
                                        onClick={handleBack}
                                        className=" flex justify-center cursor-pointer px-14 bg-[#FF7043] hover:bg-[#009688] text-white py-3 rounded-md mb-4 transition-all duration-300"
                                    >
                                        Back
                                    </div>
                                    <button
                                        type='submit'
                                        disabled={isResponse==='processing'}
                                        className=" bg-[#009688] hover:bg-[#FF7043] text-white h-12  px-12 rounded-md mb-2 transition-all duration-300"
                                    >
                                        {isResponse==='processing'?'Processing...':isResponse==='success'?' ':'Sign up'}
                                    </button>
                                </div>

                                {/* Login Link */}
                                <p className="text-center text-sm">
                                    Already have an account?{' '}
                                    <NavLink to='/rider-login'>
                                        <a href="/login" className="text-[#FF7043]">Login</a>
                                    </NavLink>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Hidden not used */}
                    < div className="hidden right w-[50%] h-[100%] justify-center items-center">
                        <div className="bg-[#FF7043] w-[70%] h-[80%] rounded-[60px] flex flex-col pt-4 justify-around items-center relative text-white ">

                            <div className='text-6xl'>WELCOME!</div>

                            <div className='className=' absolute bottom-0 >
                                <img src={image} alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </>
    );
};

export default VehicleInformation;

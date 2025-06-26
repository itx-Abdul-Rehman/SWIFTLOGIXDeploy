import React, { useState, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SidebarCustomer from './SidebarCustomer';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const CustomerRateCalculator = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");

    const [formData, setFormData] = useState({
        originCity: '',
        destinationCity: '',
        weight: '',
        shipmentType: '',
        insurance: '',
        orignalprice: '',
    });

    const [error, setError] = useState({
        weighterror: '',
        orignalpriceerror: ''
    })

    // Handle change for each input field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError({
            ...error,
            weighterror: '',
            orignalpriceerror: '',
        })
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/customer-ratecalculator`,
                    { credentials: 'include' }
                );
                const result = await response.json();
                if (!result.success) {
                    navigate('/login')
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [])

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDetails = {};



        formData.forEach((value, index) => {
            formDetails[index] = value;
        });


        if (!(formDetails.weight > 0)) {
            setError({
                ...error,
                weighterror: 'Weight must greater than 0',
                orignalpriceerror: '',
            })
            return
        }
        if (!(/^\d+$/.test(formDetails.orignalprice) || formDetails.insurance === 'no')) {
            setError({
                ...error,
                weighterror: '',
                orignalpriceerror: 'Shipment price must be entered in digits only (e.g., 1200)',
            })

            return;
        }
        if (!(formDetails.orignalprice > 0) && formDetails.insurance === 'yes') {
            setError({
                ...error,
                weighterror: '',
                orignalpriceerror: 'Orignal Price must be greater than 0',
            })
            return
        }
        setStatus("processing");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calculate-point`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDetails),
            });

            const res = await response.json();

            setStatus("success");
            navigate('/customer-price-page', {
                state: {
                    service: res.service,
                    basePrice: res.basePrice,
                    weightCharges: res.weightCharges,
                    distanceCharges: res.distanceCharges,
                    totalPrice: res.totalPrice,
                    insuranceType: res.insurance
                }
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className='flex min-h-screen overflow-hidden'>
            {/* Sidebar */}
            <SidebarCustomer />
            <SwiftBot />
            <OfflineOnline />

            {/* Main content */}
            <div className='min-[1226px]:ml-[18vw] flex-1  flex flex-col justify-start items-center overflow-auto'>
                <div className='w-full bg-[#009688] text-white flex justify-center items-center p-8'>
                    <div className='text-3xl sm:text-4xl font-semibold'>Rate Calculator</div>
                </div>

                <div className="flex justify-center w-full py-10 flex-grow overflow-auto">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center mb-6">Rate Calculator</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Origin City */}
                            <div className="mb-4">
                                <label htmlFor="originCity" className="block text-sm font-medium text-gray-700">Origin City</label>
                                <select
                                    id="originCity"
                                    name="originCity"
                                    value={formData.originCity}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                >
                                    <option value="" disabled selected>Select a city</option>
                                    <option hidden={formData.destinationCity === 'Karachi'} value="Karachi">Karachi</option>
                                    <option hidden={formData.destinationCity === 'Islamabad'} value="Islamabad">Islamabad</option>
                                    <option hidden={formData.destinationCity === 'Lahore'} value="Lahore">Lahore</option>
                                    <option hidden={formData.destinationCity === 'Rawalpindi'} value="Rawalpindi">Rawalpindi</option>
                                    <option hidden={formData.destinationCity === 'Faisalabad'} value="Faisalabad">Faisalabad</option>
                                    <option hidden={formData.destinationCity === 'Sialkot'} value="Sialkot">Sialkot</option>
                                    <option hidden={formData.destinationCity === 'Multan'} value="Multan">Multan</option>
                                    <option hidden={formData.destinationCity === 'Peshawar'} value="Peshawar">Peshawar</option>
                                    <option hidden={formData.destinationCity === 'Quetta'} value="Quetta">Quetta</option>
                                    <option hidden={formData.destinationCity === 'Bahawalpur'} value="Bahawalpur">Bahawalpur</option>
                                    <option hidden={formData.destinationCity === 'Gujranwala'} value="Gujranwala">Gujranwala</option>
                                    <option hidden={formData.destinationCity === 'Sukkar'} value="Sukkur">Sukkur</option>
                                    <option hidden={formData.destinationCity === 'Mardan'} value="Mardan">Mardan</option>
                                    <option hidden={formData.destinationCity === 'Abbottabad'} value="Abbottabad">Abbottabad</option>
                                </select>
                            </div>

                            {/* Destination City */}
                            <div className="mb-4">
                                <label htmlFor="destinationCity" className="block text-sm font-medium text-gray-700">Destination City</label>
                                <select
                                    id="destinationCity"
                                    name="destinationCity"
                                    value={formData.destinationCity}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                >
                                    <option value="" disabled selected>Select a city</option>
                                    <option hidden={formData.originCity === 'Karachi'} value="Karachi">Karachi</option>
                                    <option hidden={formData.originCity === 'Islamabad'} value="Islamabad">Islamabad</option>
                                    <option hidden={formData.originCity === 'Lahore'} value="Lahore">Lahore</option>
                                    <option hidden={formData.originCity === 'Rawalpindi'} value="Rawalpindi">Rawalpindi</option>
                                    <option hidden={formData.originCity === 'Faisalabad'} value="Faisalabad">Faisalabad</option>
                                    <option hidden={formData.originCity === 'Sialkot'} value="Sialkot">Sialkot</option>
                                    <option hidden={formData.originCity === 'Multan'} value="Multan">Multan</option>
                                    <option hidden={formData.originCity === 'Peshawar'} value="Peshawar">Peshawar</option>
                                    <option hidden={formData.originCity === 'Quetta'} value="Quetta">Quetta</option>
                                    <option hidden={formData.originCity === 'Bahawalpur'} value="Bahawalpur">Bahawalpur</option>
                                    <option hidden={formData.originCity === 'Gujranwala'} value="Gujranwala">Gujranwala</option>
                                    <option hidden={formData.originCity === 'Sukkar'} value="Sukkur">Sukkur</option>
                                    <option hidden={formData.originCity === 'Mardan'} value="Mardan">Mardan</option>
                                    <option hidden={formData.originCity === 'Abbottabad'} value="Abbottabad">Abbottabad</option>
                                </select>
                            </div>

                            {/* Weight (kg) */}
                            <div className="mb-4">
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (in kg)</label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                />
                                {error.weighterror && <p className="text-red-500 text-sm mt-1  ">{error.weighterror}</p>}
                            </div>


                            {/* Shipment Type */}
                            <div className="mb-6">
                                <label htmlFor="shipmentType" className="block text-sm font-medium text-gray-700">Shipment Type</label>
                                <select
                                    id="shipmentType"
                                    name="shipmentType"
                                    value={formData.shipmentType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                >
                                    <option value="">Shipment type</option>
                                    <option value="Ground">Ground</option>
                                    <option value="Express">Express</option>
                                </select>
                            </div>

                            {/* Insurance Type */}
                            <div className="mb-4">
                                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">Insurance Type</label>
                                <select
                                    id="insurance"
                                    name="insurance"
                                    value={formData.insurance}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                >
                                    <option value="" disabled>Insurance Type</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            {/* Shipment orignal price */}
                            {formData.insurance === 'yes' &&
                                <div className="mb-4">
                                    <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">Shipment Orignal Price</label>
                                    <input
                                        type='text'
                                        id="insurance"
                                        name="orignalprice"
                                        value={formData.orignalprice}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                        required
                                    ></input>
                                    {error.orignalpriceerror && <p className="text-red-500 text-sm mt-1  ">{error.orignalpriceerror}</p>}
                                </div>
                            }


                            <button
                                type="submit"
                                disabled={status === "processing"}
                                className="relative w-full py-2 px-4 bg-[#009688] text-white font-semibold rounded-lg hover:bg-[#FF7043] transition-all duration-300 ease-in-out"
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
                                    {status === "processing" ? "Processing..." : status === "success" ? " " : "Calculate"}
                                </span>

                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerRateCalculator;

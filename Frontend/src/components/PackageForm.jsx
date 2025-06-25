import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const PackageForm = ({ packageFormData, onPackageFormDataChange, onBackStep, onNextStep }) => {
    const [errors, setErrors] = useState({
        originCity: '',
        destinationCity: '',
        weight: '',
        pieces: '',
        pickupdate: '',
        pickuptime: '',
        insurance: '',
        pickupaddress: '',
        shipmentType: '',
        deliveryMethod: '',
        packageDescription: '',
        sensitivePackage: '',
        orignalprice: ''
    });
    const [status, setStatus] = useState("idle");


    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        if (!packageFormData.originCity) {
            newErrors.originCity = 'Origin City is required';
            valid = false;
        }

        if (!packageFormData.destinationCity) {
            newErrors.destinationCity = 'Destination City is required';
            valid = false;
        }

        if (!packageFormData.weight) {
            newErrors.weight = 'Weight is required';
            valid = false;
        } else if (isNaN(packageFormData.weight) || packageFormData.weight <= 0) {
            newErrors.weight = 'Weight must be a positive number';
            valid = false;
        }

        if (!packageFormData.pieces) {
            newErrors.pieces = 'Number of pieces is required';
            valid = false;
        } else if (isNaN(packageFormData.pieces) || packageFormData.pieces <= 0) {
            newErrors.pieces = 'Pieces must be a positive number';
            valid = false;
        }

        if (!packageFormData.shipmentType) {
            newErrors.shipmentType = 'Shipment type is required';
            valid = false;
        }

        if (!packageFormData.deliveryMethod) {
            newErrors.deliveryMethod = 'Delivery method is required';
            valid = false;
        }

        if (!packageFormData.insurance) {
            newErrors.insurance = 'Insurance type is required';
            valid = false;
        }

        if (!packageFormData.sensitivePackage) {
            newErrors.sensitivePackage = 'Sensitive Package? is required';
            valid = false;
        }
        if (!packageFormData.packageDescription) {
            newErrors.packageDescription = 'Package Descripton is required';
            valid = false;
        }


        if (packageFormData.deliveryMethod === 'pickUpRider') {
            if (!packageFormData.pickupdate) {
                newErrors.pickupdate = 'Pickup date is required';
                valid = false;
            }

            if (!packageFormData.pickupaddress) {
                newErrors.pickupaddress = 'Pickup address is required';
                valid = false;
            }

            if (!packageFormData.pickuptime) {
                newErrors.pickuptime = 'Pickup time is required';
                valid = false;
            }
        }


        if (!(/^\d+$/.test(packageFormData.orignalprice) || packageFormData.insurance === 'no')) {
            newErrors.orignalprice = 'Shipment price must be entered in digits only (e.g., 1200)';
            valid = false;
        }

        if (!(packageFormData.orignalprice > 0) && packageFormData.insurance === 'yes') {
            newErrors.orignalprice = 'Orignal Price must be greater than 0';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'pickupdate') {
            onPackageFormDataChange({
                target: { name: 'pickuptime', value: '' }
            });
        }
        onPackageFormDataChange(e)
        setErrors({
            ...errors,
            [name]: ''
        })

    };

    const handleNext = () => {
        if (validateForm()) {
            setStatus('processing')
            onNextStep();
        }
    };

    const handleBack = () => {
        onBackStep();
    };


    const getAvailablePickupTimes = () => {
        const times = [
            "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
            "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
        ];

        const now = new Date();
        const today = new Date().toISOString().split('T')[0];

        if (packageFormData.pickupdate === today) {
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTotalMinutes = currentHour * 60 + currentMinutes + 120;

            return times.filter(timeStr => {
                const [hourStr, minutePart] = timeStr.split(':');
                const minute = parseInt(minutePart);
                const isPM = timeStr.includes('PM');
                let hour = parseInt(hourStr);

                if (isPM && hour !== 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;

                const timeInMinutes = hour * 60 + minute;
                return timeInMinutes >= currentTotalMinutes;
            });
        }

        return times;
    };

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        onPackageFormDataChange({
            target: { name: 'pickupdate', value: today }
        });
    }, []);

    return (
        <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Package Information</h2>
            <form>
                <div className="w-full flex gap-4">
                    <div className="w-full">
                        {/* Origin City Input */}
                        <div className="mb-4">
                            <select
                                id="originCity"
                                name="originCity"
                                value={packageFormData.originCity}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                required
                            >
                                <option value="" disabled>Select Origin City*</option>
                                <option hidden={packageFormData.destinationCity === 'Karachi' ? true : false} value="Karachi">Karachi</option>
                                <option hidden={packageFormData.destinationCity === 'Islamabad' ? true : false} value="Islamabad">Islamabad</option>
                                <option hidden={packageFormData.destinationCity === 'Lahore' ? true : false} value="Lahore">Lahore</option>
                                <option hidden={packageFormData.destinationCity === 'Rawalpindi' ? true : false} value="Rawalpindi">Rawalpindi</option>
                                <option hidden={packageFormData.destinationCity === 'Faisalabad' ? true : false} value="Faisalabad">Faisalabad</option>
                                <option hidden={packageFormData.destinationCity === 'Sialkot' ? true : false} value="Sialkot">Sialkot</option>
                                <option hidden={packageFormData.destinationCity === 'Multan' ? true : false} value="Multan">Multan</option>
                                <option hidden={packageFormData.destinationCity === 'Peshawar' ? true : false} value="Peshawar">Peshawar</option>
                                <option hidden={packageFormData.destinationCity === 'Quetta' ? true : false} value="Quetta">Quetta</option>
                                <option hidden={packageFormData.destinationCity === 'Bahawalpur' ? true : false} value="Bahawalpur">Bahawalpur</option>
                                <option hidden={packageFormData.destinationCity === 'Gujranwala' ? true : false} value="Gujranwala">Gujranwala</option>
                                <option hidden={packageFormData.destinationCity === 'Sukkur' ? true : false} value="Sukkur">Sukkur</option>
                                <option hidden={packageFormData.destinationCity === 'Mardan' ? true : false} value="Mardan">Mardan</option>
                                <option hidden={packageFormData.destinationCity === 'Abbottabad' ? true : false} value="Abbottabad">Abbottabad</option>
                                <option hidden={packageFormData.destinationCity === 'Khanpur, Rahim Yar Khan' ? true : false} value="Khanpur, Rahim Yar Khan">Khanpur</option>

                            </select>
                            {errors.originCity && <p className="text-red-500 text-sm mt-2">{errors.originCity}</p>}
                        </div>

                        {/* Weight Input */}
                        <div className="mb-4">
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={packageFormData.weight}
                                onChange={handleChange}
                                placeholder="Weight* (in kg)"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                required
                            />
                            {errors.weight && <p className="text-red-500 text-sm mt-2">{errors.weight}</p>}
                        </div>

                        {/* Pieces Input */}
                        <div className="mb-4">
                            <input
                                type="number"
                                id="pieces"
                                name="pieces"
                                value={packageFormData.pieces}
                                onChange={handleChange}
                                placeholder="Pieces*"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                required
                            />
                            {errors.pieces && <p className="text-red-500 text-sm mt-2">{errors.pieces}</p>}
                        </div>

                        {/* insurance input */}
                        <div className="mb-4">
                            <select
                                id="insurance"
                                name="insurance"
                                value={packageFormData.insurance}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                required
                            >
                                <option value="" disabled>Insurance Type*</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                            {errors.insurance && <p className="text-red-500 text-sm mt-2">{errors.insurance}</p>}
                        </div>
                        {/* Shipment orignal price */}
                        {packageFormData.insurance === 'yes' &&
                            <div className="mb-4">
                                <input
                                    type='text'
                                    id="insurance"
                                    name="orignalprice"
                                    value={packageFormData.orignalprice}
                                    onChange={handleChange}
                                    placeholder='Shipment Orignal Price*'
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                ></input>
                                {errors.orignalprice && <p className="text-red-500 text-sm mt-1  ">{errors.orignalprice}</p>}
                            </div>
                        }


                        {/*Pickup Date input  */}
                        {packageFormData.deliveryMethod === 'pickUpRider' && packageFormData.insurance !== 'yes' && (
                            <div className="mb-4 relative">
                                <label htmlFor="pickupdate" className='absolute top-[9.5px] left-32'>Pickup Date*</label>
                                <input
                                    type="date"
                                    id="pickupdate"
                                    name="pickupdate"
                                    value={packageFormData.pickupdate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                />
                                {errors.pickupdate && <p className="text-red-500 text-sm mt-2">{errors.pickupdate}</p>}
                            </div>
                        )}

                        {
                            packageFormData.deliveryMethod === 'pickUpRider' && packageFormData.pickupdate && packageFormData.insurance === 'yes' && (
                                <div className="mb-4">
                                    <select
                                        id="pickuptime"
                                        name="pickuptime"
                                        value={packageFormData.pickuptime}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                        required
                                    >
                                        <option value="" disabled>Pickup Time*</option>
                                        {getAvailablePickupTimes().map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}

                                    </select>
                                    {errors.pickuptime && <p className="text-red-500 text-sm mt-2">{errors.pickuptime}</p>}
                                </div>
                            )}

                    </div>

                    <div className="w-full">
                        {/* Destination City Input */}
                        <div className="mb-4">
                            <select
                                id="destinationCity"
                                name="destinationCity"
                                value={packageFormData.destinationCity}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                required
                            >
                                <option value="" disabled>Select Destination City*</option>
                                <option hidden={packageFormData.originCity === 'Karachi' ? true : false} value="Karachi">Karachi</option>
                                <option hidden={packageFormData.originCity === 'Islamabad' ? true : false} value="Islamabad">Islamabad</option>
                                <option hidden={packageFormData.originCity === 'Lahore' ? true : false} value="Lahore">Lahore</option>
                                <option hidden={packageFormData.originCity === 'Rawalpindi' ? true : false} value="Rawalpindi">Rawalpindi</option>
                                <option hidden={packageFormData.originCity === 'Faisalabad' ? true : false} value="Faisalabad">Faisalabad</option>
                                <option hidden={packageFormData.originCity === 'Sialkot' ? true : false} value="Sialkot">Sialkot</option>
                                <option hidden={packageFormData.originCity === 'Multan' ? true : false} value="Multan">Multan</option>
                                <option hidden={packageFormData.originCity === 'Peshawar' ? true : false} value="Peshawar">Peshawar</option>
                                <option hidden={packageFormData.originCity === 'Quetta' ? true : false} value="Quetta">Quetta</option>
                                <option hidden={packageFormData.originCity === 'Bahawalpur' ? true : false} value="Bahawalpur">Bahawalpur</option>
                                <option hidden={packageFormData.originCity === 'Gujranwala' ? true : false} value="Gujranwala">Gujranwala</option>
                                <option hidden={packageFormData.originCity === 'Sukkur' ? true : false} value="Sukkur">Sukkur</option>
                                <option hidden={packageFormData.originCity === 'Mardan' ? true : false} value="Mardan">Mardan</option>
                                <option hidden={packageFormData.originCity === 'Abbottabad' ? true : false} value="Abbottabad">Abbottabad</option>
                                <option hidden={packageFormData.destinationCity === 'Khanpur, Rahim Yar Khan' ? true : false} value="Khanpur, Rahim Yar Khan">Khanpur</option>
                            </select>
                            {errors.destinationCity && <p className="text-red-500 text-sm mt-2">{errors.destinationCity}</p>}
                        </div>

                        {/* Shipment Type Input */}
                        <div className="mb-4">
                            <select
                                id="shipmentType"
                                name="shipmentType"
                                value={packageFormData.shipmentType}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                required
                            >
                                <option value="" disabled>Select Shipment Type*</option>
                                <option value="Ground">Ground</option>
                                <option value="Express">Express</option>
                            </select>
                            {errors.shipmentType && <p className="text-red-500 text-sm mt-2">{errors.shipmentType}</p>}
                        </div>

                        {/* Delivery Method Input */}
                        <div className="mb-4">
                            <select
                                id="deliveryMethod"
                                name="deliveryMethod"
                                value={packageFormData.deliveryMethod}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                required
                            >
                                <option value="" disabled>Select Delivery Method*</option>
                                <option value="pickUpRider">Pick-Up by Rider</option>
                                <option value="dropOffShop">Drop-Off at Shop</option>
                            </select>
                            {errors.deliveryMethod && <p className="text-red-500 text-sm mt-2">{errors.deliveryMethod}</p>}
                        </div>
                        {/* Sensitive Product */}
                        <div className="mb-4">
                            <select
                                id="sensitivePackage"
                                name="sensitivePackage"
                                value={packageFormData.sensitivePackage}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                required
                            >
                                <option value="" disabled>Sensitive Package?</option>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>

                            </select>
                            {errors.sensitivePackage && <p className="text-red-500 text-sm mt-2">{errors.sensitivePackage}</p>}
                        </div>
                        {/*Pickup Time input  */}
                        {
                            packageFormData.deliveryMethod === 'pickUpRider' && packageFormData.pickupdate && packageFormData.insurance !== 'yes' && (
                                <div className="mb-4">
                                    <select
                                        id="pickuptime"
                                        name="pickuptime"
                                        value={packageFormData.pickuptime}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                        required
                                    >
                                        <option value="" disabled>Pickup Time*</option>
                                        {getAvailablePickupTimes().map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}

                                    </select>
                                    {errors.pickuptime && <p className="text-red-500 text-sm mt-2">{errors.pickuptime}</p>}
                                </div>
                            )}


                        {/*Pickup Date input  */}
                        {packageFormData.deliveryMethod === 'pickUpRider' && packageFormData.insurance === 'yes' && (
                            <div className="mb-4 relative">
                                <label htmlFor="pickupdate" className='absolute top-[9.5px] left-32'>Pickup Date*</label>
                                <input
                                    type="date"
                                    id="pickupdate"
                                    name="pickupdate"
                                    value={packageFormData.pickupdate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7043] focus:border-[#FF7043]"
                                    required
                                />
                                {errors.pickupdate && <p className="text-red-500 text-sm mt-2">{errors.pickupdate}</p>}
                            </div>
                        )}

                    </div>
                </div>

                {/* Pickup Address */}
                {packageFormData.deliveryMethod === 'pickUpRider' && (
                    <div className="mb-4" >
                        <input
                            type="text"
                            name="pickupaddress"
                            value={packageFormData.pickupaddress}
                            onChange={handleChange}
                            placeholder="Pickup Address*"
                            className="w-full p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                        />
                        {errors.pickupaddress && <p className="text-red-500 text-sm mt-2">{errors.pickupaddress}</p>}
                    </div>
                )}

                {/* Package Description */}
                <div className="mb-4" >

                    <textarea
                        id='packageDescription'
                        name="packageDescription"
                        placeholder='Describe your Package...*'
                        onChange={handleChange}
                        value={packageFormData.packageDescription}
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                    >
                    </textarea>

                    {errors.packageDescription && <p className="text-red-500 text-sm mt-2">{errors.packageDescription}</p>}
                </div>

                {/* Button Group */}
                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="bg-[#FF7043] text-white py-2 px-4 rounded-full hover:bg-[#009688] transition duration-200 ease-in-out"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        className="relative bg-[#009688] text-white py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out"
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
                        <span >
                            {status === "processing" ? "Processing..." : status === "success" ? "" : "Next"}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PackageForm

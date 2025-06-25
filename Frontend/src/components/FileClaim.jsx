import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SwiftBot from './SwiftBot';
import OfflineOnline from './OfflineOnline';


const FileClaim = () => {
    const [isSuccessfullySubmit, setIsSuccessfullySubmit] = useState(false)
    const [isUnSuccessfullySubmit, setIsUnSuccessfullySubmit] = useState(false)
    const [isResponse, setIsResponse] = useState(true)
    const [responseMessage, setResponseMessage] = useState(null)
    const [errors, setErrors] = useState({
        trackingid: '',
        email: '',
        description: '',
        proofShipmentValue: null,
        anySupportingDocument: null
    });

    const [claimData, setClaimData] = useState({
        trackingid: '',
        email: '',
        description: '',
        proofShipmentValue: null,
        anySupportingDocument: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setErrors({
            ...errors,
            [name]: ''
        });

        if (files) {
            const file = files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSize = 20 * 1024 * 1024;

            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'Only JPG, JPEG, or PNG files are allowed*'
                }));
                setClaimData({
                    ...claimData,
                    [name]: null
                });
                return;
            }

            if (file.size > maxSize) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'File size must be under 20MB*'
                }));
                setClaimData({
                    ...claimData,
                    [name]: null
                });
                return;
            }

            setClaimData({
                ...claimData,
                [name]: file
            });
        } else {
            setClaimData({
                ...claimData,
                [name]: value
            });
        }
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        if (!claimData.trackingid) {
            newErrors.trackingid = 'Tracking Id is required*';
            valid = false;
        }

        if (claimData.trackingid.length !== 14) {
            newErrors.trackingid = 'Tracking Id is invalid*';
            valid = false;
        }

        if (!claimData.email) {
            newErrors.email = 'Email Address is required*';
            valid = false;
        }

        if (!claimData.description) {
            newErrors.description = 'Description is required*';
            valid = false;
        }

        if (!claimData.proofShipmentValue) {
            newErrors.proofShipmentValue = 'Shipment Value Proof is required*';
            valid = false;
        }

        if (!claimData.anySupportingDocument) {
            newErrors.anySupportingDocument = 'Other Supporting Document is required*';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const waitForSecond = () => {
        setTimeout(() => {
            setIsSuccessfullySubmit(false)
            setIsUnSuccessfullySubmit(false)
        }, 5000);
    }

    const handleSubmit = async (e) => {
        if (validateForm()) {
            e.preventDefault();
            setIsResponse(false)
            try {
                const formData = new FormData();
                formData.append('trackingid', claimData.trackingid);
                formData.append('email', claimData.email);
                formData.append('description', claimData.description);
                formData.append('proofShipmentValue', claimData.proofShipmentValue);
                formData.append('anySupportingDocument', claimData.anySupportingDocument);

                const response = await fetch('http://13.203.194.4:3000/insurance-claim', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                if (!response.ok) {

                }

                const result = await response.json();
                setResponseMessage(result.message)
                setIsResponse(true)
                if (result.success) {
                    setIsSuccessfullySubmit(true)
                    waitForSecond()
                    setClaimData({
                        trackingid: '',
                        email: '',
                        description: '',
                        proofShipmentValue: null,
                        anySupportingDocument: null
                    })
                } else {
                    setIsUnSuccessfullySubmit(true)
                    waitForSecond();
                }
            } catch (error) {
                setResponseMessage('Failed to submit claim')
                setIsUnSuccessfullySubmit(true)
                waitForSecond();
            }
        }
    };

    return (
        <>
            <SwiftBot />
            <OfflineOnline />
            <Navbar />
            <div className="w-full bg-[#009688] text-white flex justify-center items-center p-6 sm:p-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
                    Insurance Claim
                </div>
            </div>

            <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Fill the Information</h2>
                <form>
                    <div className='w-full gap-4'>
                        <div className='w-full'>
                            <div className="mb-4">
                                <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700">Tracking Id*</label>
                                <input
                                    type="text"
                                    name="trackingid"
                                    value={claimData.trackingid}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                                />
                                {errors.trackingid && <p className="text-red-500 text-sm mt-2">{errors.trackingid}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address*</label>
                                <input
                                    type='email'
                                    name="email"
                                    required
                                    value={claimData.email}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700">Description*</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={claimData.description}
                                    onChange={handleChange}
                                    placeholder='Describe the issue'
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                            </div>
                        </div>

                        <div className='w-full'>
                            <div className="mb-4">
                                <label htmlFor="proofShipmentValue" className="block text-sm font-medium text-gray-700">Shipment Value Proof* (invoice/receipt)</label>
                                <input
                                    type="file"
                                    name="proofShipmentValue"
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                                />
                                {errors.proofShipmentValue && <p className="text-red-500 text-sm mt-2">{errors.proofShipmentValue}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="anySupportingDocument" className="block text-sm font-medium text-gray-700">Other Supporting Document</label>
                                <input
                                    type="file"
                                    name="anySupportingDocument"
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                                />
                                {errors.anySupportingDocument && <p className="text-red-500 text-sm mt-2">{errors.anySupportingDocument}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 ">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-[#009688] text-white py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out"
                        >
                            {isResponse ? 'Submit' : 'Submiting...'}
                        </button>
                    </div>
                </form>
            </div>

            {/* submit notification */}
            {isSuccessfullySubmit &&
                <div className='border-none bg-[#009688] text-white w-60 p-4 absolute bottom-8 right-4  bg-opacity-3 backdrop-blur-lg '>
                    Claim submitted successfully
                </div>
            }
            {isUnSuccessfullySubmit &&
                <div className='border-none bg-[#FF7043] text-white w-60 p-4 absolute bottom-8 right-4  bg-opacity-3 backdrop-blur-lg '>
                    {responseMessage}
                </div>
            }

            <Footer />
        </>
    );
};

export default FileClaim;

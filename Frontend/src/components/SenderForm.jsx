import React, { useState } from 'react';

const SenderForm = ({ senderFormData, onSenderFormDataChange, onNextStep, useMyProfile, userData }) => {
    const [isUse, setisUse] = useState(false)
    const [errors, setErrors] = useState({
        sendername: '',
        sendercontact: '',
        senderemail: '',
        sendercnic: ''
    });
     

    const handleChange = (e) => {
        const { name } = e.target;
        onSenderFormDataChange(e);
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        // Validate sendername
        if (!senderFormData.sendername) {
            newErrors.sendername = 'Name is required';
            valid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(senderFormData.sendername)) {
            newErrors.sendername = 'Name must contain only alphabets';
            valid = false;
        }

        // Validate sendercontact
        if (!senderFormData.sendercontact) {
            newErrors.sendercontact = 'Contact number is required';
            valid = false;
        } else if (!/^[0-9]+$/.test(senderFormData.sendercontact)) {
            newErrors.sendercontact = 'Contact number must contain only digits';
            valid = false;
        }

        // Validate senderemail
        if (!senderFormData.senderemail) {
            newErrors.senderemail = 'Email is required';
            valid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(senderFormData.senderemail)) {
            newErrors.senderemail = 'Please enter a valid email address';
            valid = false;
        }

        // Validate sendercnic
        if (!senderFormData.sendercnic) {
            newErrors.sendercnic = 'CNIC is required';
            valid = false;
        } else if (!/^[0-9]{13}$/.test(senderFormData.sendercnic)) {
            newErrors.sendercnic = 'CNIC must be exactly 13 digits';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNextStep();
        }
    };

    const handleUseMyProfile=()=>{
        userData()
    }


    return (
        <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Sender Information</h2>
            <form>
                <div className='w-full flex gap-4'>
                    <div className='w-full'>
                        {/* Name Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="sendername"
                                value={senderFormData.sendername}
                                onChange={handleChange}
                                placeholder='Name'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.sendername && <p className="text-red-500 text-sm mt-2">{errors.sendername}</p>}
                        </div>

                        {/* Contact Number Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="sendercontact"
                                value={senderFormData.sendercontact}
                                onChange={handleChange}
                                placeholder='Contact No'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.sendercontact && <p className="text-red-500 text-sm mt-2">{errors.sendercontact}</p>}
                        </div>
                    </div>
                    <div className='w-full'>
                        {/* Email Input */}
                        <div className="mb-4">
                            <input
                                type="email"
                                name="senderemail"
                                value={senderFormData.senderemail}
                                onChange={handleChange}
                                placeholder='Email Address'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.senderemail && <p className="text-red-500 text-sm mt-2">{errors.senderemail}</p>}
                        </div>

                        {/* CNIC Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="sendercnic"
                                value={senderFormData.sendercnic}
                                onChange={handleChange}
                                placeholder='CNIC'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                            />
                            {errors.sendercnic && <p className="text-red-500 text-sm mt-2">{errors.sendercnic}</p>}
                        </div>
                    </div>
                </div>
                {/* Button Group */}
                <div className={`flex  ${useMyProfile?'justify-between':'justify-end'} mt-6`}>
                    {useMyProfile && (
                        <button
                            type="button"
                            onClick={handleUseMyProfile}
                            className="bg-[#009688] text-white py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out"
                        >
                            Use My Profile
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#009688] text-white py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SenderForm;
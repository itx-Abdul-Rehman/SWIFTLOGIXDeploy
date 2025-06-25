import React, { useState } from 'react'
import mapicon from './icons/map.svg';
import Map from './Map';

const ReceiverForm = ({ receiverFormData, onReceiverFormDataChange, onBackStep, onNextStep }) => {
    const [address, setAddress] = useState("")
    const [mapShow, setmapShow] = useState(false)
    const [errors, setErrors] = useState({
        receivername: '',
        receivercontact: '',
        receiveremail: '',
        receivercnic: '',
        receiverarea: '',
        receiverhouseno: '',
        receiveraddress: ''
    });

    const handleChange = (e) => {
        const { name } = e.target;
        onReceiverFormDataChange(e);
        setErrors({
            ...errors,
            [name]: ''
        });

    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        if (!receiverFormData.receivername) {
            newErrors.receivername = 'Name is required';
            valid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(receiverFormData.receivername)) {
            newErrors.receivername = 'Name must contain only alphabets';
            valid = false;
        }
        if (!receiverFormData.receivercontact) {
            newErrors.receivercontact = 'Contact number is required';
            valid = false;
        } else if (!/^[0-9]+$/.test(receiverFormData.receivercontact)) {
            newErrors.receivercontact = 'Contact number must contain only digits';
            valid = false;
        }
        if (!receiverFormData.receiveremail) {
            newErrors.receiveremail = 'Email is required';
            valid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(receiverFormData.receiveremail)) {
            newErrors.receiveremail = 'Please enter a valid email address';
            valid = false;
        }
        if (!receiverFormData.receivercnic) {
            newErrors.receivercnic = 'CNIC is required';
            valid = false;
        } else if (!/^[0-9]{13}$/.test(receiverFormData.receivercnic)) {
            newErrors.receivercnic = 'CNIC must be exactly 13 digits';
            valid = false;
        }
        if (!receiverFormData.receiverarea) {
            newErrors.receiverarea = 'Area/Town is required';
            valid = false;
        }
        if (!receiverFormData.receiverhouseno) {
            newErrors.receiverhouseno = 'Building/House no is required';
            valid = false;
        }
        if (!receiverFormData.receiveraddress) {
            newErrors.receiveraddress = 'Full Address is required';
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

    const handleBack = () => {
        onBackStep();
    };

    const updateAddress = (newAddress) => {
        setAddress(newAddress);  
      };

    return (

        <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Receiver Information</h2>
            <form>
                <div className='w-full flex gap-4'>
                    <div className='w-full'>
                        {/* Name Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="receivername"
                                value={receiverFormData.receivername}
                                onChange={handleChange}
                                placeholder='Name*'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.receivername && <p className="text-red-500 text-sm mt-2">{errors.receivername}</p>}
                        </div>

                        {/* contact Number Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="receivercontact"
                                value={receiverFormData.receivercontact}
                                onChange={handleChange}
                                placeholder='Contact No*'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.receivercontact && <p className="text-red-500 text-sm mt-2">{errors.receivercontact}</p>}
                        </div>
                        {/* Area-Town Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="receiverarea"
                                value={receiverFormData.receiverarea}
                                onChange={handleChange}
                                placeholder='Area/Town*'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.receiverarea && <p className="text-red-500 text-sm mt-2">{errors.receiverarea}</p>}
                        </div>
                    </div>
                    <div className='w-full'>
                        {/* Email Input */}
                        <div className="mb-4">
                            <input
                                type="email"
                                name="receiveremail"
                                value={receiverFormData.receiveremail}
                                onChange={handleChange}
                                placeholder='Email Address*'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.receiveremail && <p className="text-red-500 text-sm mt-2">{errors.receiveremail}</p>}
                        </div>

                        {/* CNIC Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="receivercnic"
                                value={receiverFormData.receivercnic}
                                onChange={handleChange}
                                placeholder='CNIC*'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.receivercnic && <p className="text-red-500 text-sm mt-2">{errors.receivercnic}</p>}
                        </div>
                        {/* House no input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="receiverhouseno"
                                value={receiverFormData.receiverhouseno}
                                onChange={handleChange}
                                placeholder='Building/House No*'
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043]  focus:outline-none transition duration-200"
                            />
                            {errors.receiverhouseno && <p className="text-red-500 text-sm mt-2">{errors.receiverhouseno}</p>}
                        </div>
                    </div>
                </div>

                {/* Full Address input */}
                <div className="mb-4" >
                    <div className='flex gap-3'>
                        <input
                            type="text"
                            name="receiveraddress"
                            value={receiverFormData.receiveraddress || address}
                            onChange={handleChange}
                            placeholder="Full Address*"
                            className="w-full p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition duration-200"
                        />
                        {/* <div>
                            <img src={mapicon} alt="Mapicon" onClick={()=>{setmapShow(true)}} className='w-10 cursor-pointer' />
                        </div> */}
                    </div>

                    {errors.receiveraddress && <p className="text-red-500 text-sm mt-2">{errors.receiveraddress}</p>}
                </div>



                {/* Button Group */}
                <div className="flex justify-between mt-6">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={handleBack}
                        className="bg-[#FF7043] text-white py-2 px-4 rounded-full hover:bg-[#009688] transition duration-200 ease-in-out"
                    >
                        Back
                    </button>

                    {/* Next Button */}
                    <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#009688] text-white py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out"
                    >
                        Next
                    </button>
                </div>
            </form>

             {mapShow===true && 
             <Map 
               updateAddress={updateAddress}
              />}
        </div >


    )
}

export default ReceiverForm

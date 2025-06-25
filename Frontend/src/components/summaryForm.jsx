import React, { useState } from 'react';
import RateDisplay from './RateDisplay';
import RateDisplayShip from './RateDisplayShip';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import angleup from './icons/angleup.svg';

const SummaryForm = ({ senderFormData, receiverFormData, packageFormData, onBackStep, onNextStep, packagePrice }) => {
    const [showPriceDetails, setshowPriceDetails] = useState(false)

    const handleShowPriceDetails = () => {
        if (showPriceDetails === false) {
            setshowPriceDetails(true);

        } else {
            setshowPriceDetails(false)
        }

        //   setpriceDetailsIcon("")   
    }


    return (
        <div className="mt-3 px-4 md:px-8">
            {/* Sender Information Section */}
            <div className="w-full flex justify-center items-center">
                <div className="bg-white w-full max-w-4xl border border-[#e2e8f0] p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Sender Information</h3>
                    <div className='flex flex-col md:flex-row gap-6 text-gray-700'>
                        <div>
                            <p className='pb-2'><strong>Name:</strong> {senderFormData.sendername}</p>
                            <p><strong>Contact:</strong> {senderFormData.sendercontact}</p>
                        </div>
                        <div>
                            <p className='pb-2'><strong>Email:</strong> {senderFormData.senderemail}</p>
                            <p><strong>CNIC:</strong> {senderFormData.sendercnic}</p>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Receiver Information Section */}
            <div className="w-full flex justify-center items-center mt-6">
                <div className="bg-white w-full max-w-4xl border border-[#e2e8f0] p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Receiver Information</h3>
                    <div className='flex flex-col md:flex-row gap-6 pb-2 text-gray-700'>
                        <div>
                            <p className='pb-2'><strong>Name:</strong> {receiverFormData.receivername}</p>
                            <p className='pb-2'><strong>Contact:</strong> {receiverFormData.receivercontact}</p>
                            <p><strong>Area/Town:</strong> {receiverFormData.receiverarea}</p>
                        </div>
                        <div>
                            <p className='pb-2'><strong>Email:</strong> {receiverFormData.receiveremail}</p>
                            <p className='pb-2'><strong>CNIC:</strong> {receiverFormData.receivercnic}</p>
                            <p><strong>Building/House no:</strong> {receiverFormData.receiverhouseno}</p>
                        </div>
                    </div>
                    <div className='text-gray-700'>
                        <p><strong>Full Address:</strong> {receiverFormData.receiveraddress}</p>
                    </div>
                </div>
            </div>
    
            {/* Package Information Section */}
            <div className="w-full flex justify-center items-center mt-6">
                <div className="bg-white w-full max-w-4xl border border-[#e2e8f0] p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Package Information</h3>
                    <div className='flex flex-col md:flex-row gap-6 text-gray-700'>
                        <div>
                            <p className='pb-2'><strong>Origin City:</strong> {packageFormData.originCity}</p>
                            <p className='pb-2'><strong>Weight:</strong> {packageFormData.weight} kg</p>
                        </div>
                        <div>
                            <p className='pb-2'><strong>Destination City:</strong> {packageFormData.destinationCity}</p>
                            <p className='pb-2'><strong>Pieces:</strong> {packageFormData.pieces}</p>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-6 text-gray-700 mt-4'>
                        <div>
                            <p className='pb-2'><strong>Shipment Type:</strong> {packageFormData.shipmentType}</p>
                            <p className='pb-2'><strong>Delivery Method:</strong> {packageFormData.deliveryMethod}</p>
                            <p className='pb-2'><strong>Sensitive Product:</strong> {packageFormData.sensitivePackage}</p>
                        </div>
                        <div>
                            <p className='pb-2'><strong>Insurance:</strong> {packageFormData.insurance}</p>
                            {packageFormData.deliveryMethod === "pickUpRider" && (
                                <div>
                                    <p className='pb-2'><strong>Pick-up Date:</strong> {packageFormData.pickupdate}</p>
                                    <p className='pb-2'><strong>Pickup Time:</strong> {packageFormData.pickuptime}</p>
                                </div>
                            )}
                        </div>
                    </div>
    
                    {packageFormData.deliveryMethod === "pickUpRider" && (
                        <div className='text-gray-700 mt-4'>
                            <p className='pb-2'><strong>Pickup Address:</strong> {packageFormData.pickupaddress}</p>
                        </div>
                    )}
    
                    <div className='text-gray-700 mt-4'>
                        <p className='pb-2'><strong>Description:</strong> {packageFormData.packageDescription}</p>
                    </div>
                </div>
            </div>
    
            {/* Total Price Section */}
            <div className='w-full flex flex-col items-center mt-6'>
                <div className='w-full max-w-4xl flex justify-end gap-2 items-center px-2 mr-[10%]'>
                    <p className='text-lg md:text-xl'><strong className='text-2xl'>Total Price:</strong> {packagePrice.totalPrice}</p>
                    {showPriceDetails
                        ? <FaAngleUp size={28} onClick={handleShowPriceDetails} className='cursor-pointer' />
                        : <FaAngleDown size={28} onClick={handleShowPriceDetails} className='cursor-pointer' />
                    }
                </div>
                {showPriceDetails && (
                    <RateDisplayShip packagePrice={packagePrice} />
                )}
            </div>
    
            {/* Navigation Buttons */}
            <div className='w-full flex justify-center my-10'>
                <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between gap-4">
                    <button
                        onClick={onBackStep}
                        className="bg-[#FF7043] text-white sm:w-28 h-10  rounded-full hover:bg-[#009688] transition duration-200 ease-in-out"
                    >
                        Back
                    </button>
    
                    <button
                        onClick={onNextStep}
                        className="bg-[#009688] mb-10 text-white py-2 px-4 md:mr-[10%] rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out"
                    >
                        Make Payment
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default SummaryForm;
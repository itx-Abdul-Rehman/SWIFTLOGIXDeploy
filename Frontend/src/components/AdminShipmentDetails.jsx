import React, { useState } from 'react';
import RateDisplay from './RateDisplay';
import RateDisplayShip from './RateDisplayShip';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import angleup from './icons/angleup.svg';

const AdminShipmentDetails = ({ senderFormData, receiverFormData, packageFormData, packagePrice, riderInfo }) => {
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
        <div className="mt-3 px-4 ">
            {/* Sender Information Section */}
            <div className="w-full flex justify-center items-center">
                <div className="bg-white w-full md:w-[90%] border border-[#e2e8f0] p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Sender Information</h3>
                    <div className="flex flex-col sm:flex-row sm:gap-10 text-gray-700">
                        <div className="mb-2 sm:mb-0">
                            <p className="pb-2"><strong>Name:</strong> {senderFormData.sendername}</p>
                            <p><strong>Contact:</strong> {senderFormData.sendercontact}</p>
                        </div>
                        <div>
                            <p className="pb-2"><strong>Email:</strong> {senderFormData.senderemail}</p>
                            <p><strong>CNIC:</strong> {senderFormData.sendercnic}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Receiver Information Section */}
            <div className="w-full flex justify-center items-center mt-4">
                <div className="bg-white w-full md:w-[90%] border border-[#e2e8f0] p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Receiver Information</h3>
                    <div className="flex flex-col sm:flex-row sm:gap-10 pb-2 text-gray-700">
                        <div className="mb-2 sm:mb-0">
                            <p className="pb-2"><strong>Name:</strong> {receiverFormData.receivername}</p>
                            <p className="pb-2"><strong>Contact:</strong> {receiverFormData.receivercontact}</p>
                            <p><strong>Area/Town:</strong> {receiverFormData.receiverarea}</p>
                        </div>
                        <div>
                            <p className="pb-2"><strong>Email:</strong> {receiverFormData.receiveremail}</p>
                            <p className="pb-2"><strong>CNIC:</strong> {receiverFormData.receivercnic}</p>
                            <p><strong>Building/House no:</strong> {receiverFormData.receiverhouseno}</p>
                        </div>
                    </div>
                    <div className="w-full text-gray-700">
                        <p><strong>Full Address:</strong> {receiverFormData.receiveraddress}</p>
                    </div>
                </div>
            </div>

            {/* Package Information Section */}
            <div className="w-full flex justify-center items-center mt-4">
                <div className="bg-white w-full md:w-[90%] border border-[#e2e8f0] p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Package Information</h3>
                    <div className="flex flex-col sm:flex-row sm:gap-10 text-gray-700 mb-4">
                        <div className="mb-2 sm:mb-0">
                            <p className="pb-2"><strong>Origin City:</strong> {packageFormData.originCity}</p>
                            <p className="pb-2"><strong>Weight:</strong> {packageFormData.weight} kg</p>
                        </div>
                        <div>
                            <p className="pb-2"><strong>Destination City:</strong> {packageFormData.destinationCity}</p>
                            <p className="pb-2"><strong>Pieces:</strong> {packageFormData.pieces}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-10 text-gray-700 mb-4">
                        <div className="mb-2 sm:mb-0">
                            <p className="pb-2"><strong>Shipment Type:</strong> {packageFormData.shipmentType}</p>
                            <p className="pb-2"><strong>Delivery Method:</strong> {packageFormData.deliveryMethod}</p>
                            <p className="pb-2"><strong>Sensitive Product:</strong> {packageFormData.sensitivePackage}</p>
                        </div>
                        <div>
                            <p className="pb-2"><strong>Insurance:</strong> {packageFormData.insurance}</p>
                            {packageFormData.deliveryMethod === "pickUpRider" && (
                                <div>
                                    <p className="pb-2"><strong>Pick-up Date:</strong> {packageFormData.pickupdate}</p>
                                    <p className="pb-2"><strong>Pickup Time:</strong> {packageFormData.pickuptime}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {packageFormData.deliveryMethod === "pickUpRider" && (
                        <div className="text-gray-700 mb-4">
                            <p className="pb-2"><strong>Pickup Address:</strong> {packageFormData.pickupaddress}</p>
                        </div>
                    )}

                    <div className="text-gray-700">
                        <p className="pb-2"><strong>Description:</strong> {packageFormData.packageDescription}</p>
                    </div>
                </div>
            </div>

            {/* Rider Information Section */}
            {riderInfo &&
                <div className="w-full flex justify-center items-center mt-4">
                    <div className="bg-white w-full md:w-[90%] border border-[#e2e8f0] p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Rider Information</h3>
                        <div className="flex flex-col sm:flex-row sm:gap-10 text-gray-700">
                            <div className="mb-2 sm:mb-0">
                                <p className="pb-2"><strong>Name:</strong> {riderInfo.name}</p>
                                <p><strong>Contact:</strong> {riderInfo.mobileno}</p>
                            </div>
                            <div>
                                <p className="pb-2"><strong>Email:</strong> {riderInfo.email}</p>
                                <p><strong>CNIC:</strong> {riderInfo.cnic}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Total Price Section */}
            <div className="flex flex-col items-center my-4 px-2">
                <div className="flex items-center justify-center w-full md:w-[90%] text-gray-800">
                    <p className="text-[1.2rem] sm:text-xl">
                        <strong className="text-2xl font-bold sm:text-3xl">Total Price:</strong> {packagePrice.totalPrice}
                    </p>
                </div>
            </div>
        </div>
    );

};

export default AdminShipmentDetails;
import React, { useState } from 'react';


const RiderShipmentCard = ({ trackingNumber, originCity, destinationCity, weight, pieces, deliveryDate, price, selectedCard, onCancel }) => {

    return (
        <>
            <div
                className="max-w-sm w-full bg-white  rounded-lg shadow-md p-4 hover:scale-105 transition-all duration-300"
            >
                {/* Header (Tracking Number) */}
                <div className="flex justify-start  mb-4">
                    <span className="font-semibold text-lg text-[#009688]">Tracking# {trackingNumber}</span>
                    {/* <p className="text-gray-600 "><strong>{datetime}</strong></p> */}
                </div>

                <div>
                    <p className="text-gray-600">Origin City: <strong>{originCity}</strong></p>
                    <p className="text-gray-600">Destination City: <strong>{destinationCity}</strong></p>
                    <p className="text-gray-600">Weight: <strong>{weight}</strong></p>
                    <p className="text-gray-600">Pieces: <strong>{pieces}</strong></p>
                    <p className="text-gray-600">Delivery Date: <strong>{deliveryDate}</strong></p>
                    <p className="text-gray-600">Price: <strong>{price}</strong></p>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end items-center gap-2">
                    {selectedCard === 'accepted' &&
                        <button  onClick={onCancel} className="bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300">
                            Cancel
                        </button>
                    }
                </div>

            </div>

        </>
    );
};

export default RiderShipmentCard;

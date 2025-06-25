import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const ShipmentCard = ({ trackingNumber, originCity, destinationCity, receiverName,
    datetime, onClick, droppedButtonShow, handleDroppedShipments, shipmentStatus,
    selectedCard, onClickPick, deliveryDate, processingIndex, index }) => {
        const [status, setStatus] = useState(false);

    const handleDropped = async () => {
        setStatus(true)
        handleDroppedShipments();
    }

    const handlePick = () => {
        onClickPick()
    }

    return (
        <div
            className="w-full sm:w-[90%] md:w-[70%] lg:max-w-sm bg-white border rounded-xl shadow-md p-4 hover:scale-105 transition-all duration-300"
        >
            {/* Header (Tracking Number + Date) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <span className="font-semibold text-base sm:text-lg text-[#009688]">
                    Tracking# {trackingNumber}
                </span>
                <p className="text-gray-600 text-sm sm:text-base">
                    <strong>{datetime}</strong>
                </p>
            </div>

            {/* Shipment Info */}
            <div className="text-sm sm:text-base">
                <p className="text-gray-600">
                    Origin City: <strong>{originCity}</strong>
                </p>
                <p className="text-gray-600">
                    Destination City: <strong>{destinationCity}</strong>
                </p>
                <p className="text-gray-600">
                    Receiver Name: <strong>{receiverName}</strong>
                </p>
                {deliveryDate &&
                    <p className="text-gray-600">
                        Delivery Date: <strong>{deliveryDate}</strong>
                    </p>
                }
            </div>

            {/* Footer Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <button onClick={onClick} className="bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base">
                    Shipment Details
                </button>
                {droppedButtonShow &&
                    <>
                        {selectedCard === 'scheduled' &&
                            <button disabled={shipmentStatus === 'dropped'} onClick={handleDropped} className={`bg-[#009688] text-white px-4 py-2 rounded-lg ${shipmentStatus != 'dropped' && 'hover:bg-[#FF7043]'} transition-all duration-300 text-sm sm:text-base`}>
                            
                                {shipmentStatus === 'dropped' ? 'Dropped' : processingIndex===index?'Processing...': 'Drop?'}
                            </button>
                        }
                        {selectedCard === 'accepted' &&
                            <button disabled={shipmentStatus === 'dropped'} onClick={handlePick} className={`bg-[#009688] text-white px-4 py-2 rounded-lg ${shipmentStatus != 'dropped' && 'hover:bg-[#FF7043]'} transition-all duration-300 text-sm sm:text-base`}>
                                {shipmentStatus === 'accepted' ? processingIndex===index?'Processing...': 'Pick?' : 'Picked'}
                            </button>
                        }
                    </>
                }
            </div>
        </div>
    );

};

export default ShipmentCard;

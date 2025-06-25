import { useEffect } from 'react';
import tick from './icons/tick.svg'

const AdminRiderCard = ({ name, cnic, datetime, onClick,
    onAccept, onReject, selectedCard,processingIndex, processingStatus, index }) => {


    return (
        <div
            className="w-full sm:w-[90%] md:w-[70%] lg:max-w-sm bg-white border rounded-xl shadow-md p-4 hover:scale-105 transition-all duration-300"
        >
            {/* Header (Tracking Number + Date) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                <p className="text-gray-600">
                    <strong>Name:</strong> {name}
                </p>

                {selectedCard != 'active' &&
                    < p className="text-gray-600 text-sm sm:text-base">
                        <strong>{datetime}</strong>
                    </p>
                }

            </div>
            {selectedCard == 'active' &&
                <p className="text-gray-600">
                    <strong>CNIC:</strong> {cnic}
                </p>
            }


            {/* Footer Buttons */}
            <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
                <button onClick={onClick} className="bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base">
                    Details
                </button>

                {selectedCard === 'pending' &&
                    <div className='flex gap-2'>
                        <button onClick={onAccept} className={`bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base`}>
                            {processingIndex===index && processingStatus==='active'?'Processing...':'Accept'}
                            
                        </button>

                        <button onClick={onReject} className={`bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base`}>
                           {processingIndex === index && processingStatus === 'rejected' ? 'Processing...' : 'Reject'}
                        </button>
                    </div>
                }
                {selectedCard === 'active' &&
                    <div className='flex gap-2'>
                        <button onClick={onReject} className={`bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base`}>
                             {processingIndex===index && processingStatus==='rejected'?'Processing...':'Block'}

                        </button>
                    </div>
                }
                {selectedCard === 'rejected' &&
                    <div className='flex gap-2'>
                        <button onClick={onAccept} className={`bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base`}>
                             {processingIndex===index && processingStatus==='active'?'Processing...':'Unblock'}
                        </button>
                    </div>
                }


            </div>
        </div >
    );

};

export default AdminRiderCard;

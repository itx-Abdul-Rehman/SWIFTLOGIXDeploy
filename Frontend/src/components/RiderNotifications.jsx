import React, { useState } from 'react'
import close from './icons/close.png'

const RiderNotification = ({onClose}) => {
    const [notification, setNotification] = useState('Successfully accepted shipment');

    return (
        <div className='w-[25vw] ml-[17vw] absolute top-[20vh] overflow-y-scroll max-h-[70vh]  min-h-[50vh] border p-2  rounded-xl bg-white shadow-lg'>
                <div className='w-full flex justify-between items-center  '>
                    <button className='py-1 px-2 font-semibold  text-white bg-[#009688] rounded-lg'>Clear all</button>
                    <div onClick={onClose} ><img src={close} alt="" className='w-[24px] cursor-pointer' /></div>
                </div>
          

            <div className="my-2 w-full border border-gray-300 mb-4"></div>
            
            {/* Dummy notifications */}
            <div className="w-full bg-white text-gray-700 border mb-1  p-4 rounded-lg shadow-md flex justify-between items-center">
                <span>{notification}</span>
                <button
                    className="text-[#FF7043] font-bold text-xl cursor-pointer"
                >
                    &times;
                </button>
            </div>

            <div className="w-full bg-white text-gray-700 border mb-1  p-4 rounded-lg shadow-md flex justify-between items-center">
                <span>{notification}</span>
                <button
                    className="text-[#FF7043] font-bold text-xl cursor-pointer"
                >
                    &times;
                </button>
            </div>

            <div className="w-full bg-white text-gray-700 border mb-1  p-4 rounded-lg shadow-md flex justify-between items-center">
                <span>{notification}</span>
                <button
                    className="text-[#FF7043] font-bold text-xl cursor-pointer"
                >
                    &times;
                </button>
            </div>

            <div className="w-full bg-white text-gray-700 border mb-1  p-4 rounded-lg shadow-md flex justify-between items-center">
                <span>{notification}</span>
                <button
                    className="text-[#FF7043] font-bold text-xl cursor-pointer"
                >
                    &times;
                </button>
            </div>

            <div className="w-full bg-white text-gray-700 border mb-1  p-4 rounded-lg shadow-md flex justify-between items-center">
                <span>{notification}</span>
                <button
                    className="text-[#FF7043] font-bold text-xl cursor-pointer"
                >
                    &times;
                </button>
            </div>

            <div className="w-full bg-white text-gray-700 border mb-1  p-4 rounded-lg shadow-md flex justify-between items-center">
                <span>{notification}</span>
                <button
                    className="text-[#FF7043] font-bold text-xl cursor-pointer"
                >
                    &times;
                </button>
            </div>

            <div className="w-full bg-white text-gray-700 border mb-1  p-4 rounded-lg shadow-md flex justify-between items-center">
                <span>{notification}</span>
                <button
                    className="text-[#FF7043] font-bold text-xl cursor-pointer"
                >
                    &times;
                </button>
            </div>

            <div className="w-full bg-white text-gray-700 border mb-1  p-4 rounded-lg shadow-md flex justify-between items-center">
                <span>{notification}</span>
                <button
                    className="text-[#FF7043] font-bold text-xl cursor-pointer"
                >
                    &times;
                </button>
            </div>




        </div>
    );
}

export default RiderNotification

import React from 'react'
import close from './icons/close.png'

const CustomerSetting = ({onClose}) => {


    return (
        <div className='w-[25vw] bg-white absolute bottom-[5vw] left-[17vw] text-gray-700 p-4 shadow-2xl border rounded-2xl '>
            <div className='flex justify-between'>
                <div className='font-semibold text-lg'>Settings</div>
                <div onClick={onClose} ><img src={close} alt="" className='w-[24px] cursor-pointer' /></div>
            </div>
            <div className="my-2 w-full border border-gray-300"></div>
            <div className='flex flex-col gap-4'>
                <div className='flex justify-between items-center rounded-lg'>
                    <div>Theme</div>
                    <div className='border rounded-lg p-1'>
                        <select name="theme" id="theme">
                            <option value="light" selected>Light</option>
                            {/* <option value="dark">Dark</option> */}
                        </select>
                    </div>
                </div>
                <div className='flex justify-between'>
                    <div>Language</div>
                    <div className='border p-1 rounded-lg'>
                        <select name="language" id="language">
                            <option value="english" selected>English</option>
                            {/* <option value="Urdu">Urdu</option> */}
                        </select>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CustomerSetting

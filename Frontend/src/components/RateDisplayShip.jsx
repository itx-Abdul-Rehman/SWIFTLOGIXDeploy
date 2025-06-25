import React from 'react'

const RateDisplayShip = ({packagePrice}) => {
   
    return (
        <div>
            
            {/*here display price info*/}

            <div className='w-[100vw] flex justify-center items-center flex-col  my-10  '>
                <div className='min-w-[60%] m-4'> <div className='font-semibold text-4xl'>Price Details:</div></div>
                <div className='min-w-[60%]  border-[2px] '>
                    <div className='w-[100%] font-semibold bg-[#009688]  flex justify-center items-center'>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">Service</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">Base Price</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">Weight Charges</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">Distance Charges</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">Insurance</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">Total Price</div>
                    </div>
                    <div className='w-[100%] font-semibold  flex justify-center items-center'>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">{packagePrice.service}</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">{packagePrice.basePrice}</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">{packagePrice.weightCharges}</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">{packagePrice.distanceCharges}</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">{packagePrice.insurance}</div>
                        <div className="w-[25%]  border-[1px] flex  items-center p-1">{packagePrice.totalPrice}</div>
                    </div>
                </div>
              
            </div>
            
        </div>
    )
}

export default RateDisplayShip

import React from 'react'

const SuccessfulPayment = ({onComplete}) => {

  const handleContinue=()=>{
     onComplete();
    
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='flex flex-col gap-4 my-4 items-center'>
        <div className='font-semibold'>Payment Completed!</div>
        <div>
          <button
            type="button"
            onClick={handleContinue}
            className="bg-[#009688] text-white py-2 px-4 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessfulPayment

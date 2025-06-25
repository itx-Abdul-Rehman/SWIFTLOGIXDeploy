import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import close from './icons/close.png'
import SidebarRider from './SidebarRider';
import Withdraw from './Withdraw';
import tick from './icons/tick.svg'
import paid from './icons/paid.png'
import html2canvas from "html2canvas";
import OfflineOnline from './OfflineOnline';

const RiderWallet = () => {
  const navigate = useNavigate();
  const [walletPoints, setwalletPoints] = useState(null)
  const [walletTransactions, setwalletTransactions] = useState([])
  const [userData, setuserData] = useState(null)
  const [showWithdrawMehtod, setShowWithdrawMethod] = useState(false)
  const [showWithdrawAmountField, setShowWithdrawAmountField] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('')
  const [transactionTime, setTransactionTime] = useState('')
  const [showTransactionNotify, setShowTransactionNotify] = useState(false)
  const captureRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://13.234.75.47:3000/rider-wallet',
          { credentials: 'include' }
        );
        const result = await response.json();

        if (result.success) {
          setuserData(result.userData)
          setwalletPoints(result.points);
          setwalletTransactions(result.transactions);
          return
        }

        navigate('/rider-login')

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const hanldeWithdraw = () => {
    setShowWithdrawAmountField(false)
    setShowWithdrawMethod(true)
  }


  const handleOnBack = () => {
    setShowWithdrawMethod(false)
  }

  const handleCashWithdraw = () => {
    setShowWithdrawMethod(false)
    setShowWithdrawAmountField(true)
  }

  const handleWithdrawPointsButton = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.');
      return
    }

    if (parseInt(withdrawAmount) > parseInt(walletPoints)) {
      setErrorMessage('Insufficient Points.');
      return;
    }

    try {
      const response = await fetch('http://13.234.75.47:3000/withdraw-money-cash', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawAmount })
      })

      if (!response.ok) {
        console.log('Response error')
        return
      }

      const result = await response.json();
     
      if (result.success) {
        setwalletPoints(result.remainingPoints);
        setTransactionId(result.transactionId);
        setTransactionTime(result.datetime)
        setShowTransactionNotify(true)
      }

    } catch (error) {

    }

  }


  const handleNotifyCancel = () => {
    setShowWithdrawMethod(false)
    setShowTransactionNotify(false)
    setShowWithdrawAmountField(false)
    setWithdrawAmount(null)
    setTransactionId(null)
    setTransactionTime(null)
    window.location.reload();
  }

  const handleSave = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current, { backgroundColor: null }).then(canvas => {
        const link = document.createElement("a");
        link.download = "withdraw-success.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  }
   
  const hanldeWalletClose=()=>{
     setShowWithdrawAmountField(!showWithdrawAmountField)
     setWithdrawAmount(null)
  }


  return (
    <div className='flex flex-col min-[1226px]:flex-row'>
      <SidebarRider />

      <div className='w-full min-[1226px]:ml-[18vw]'>
        <OfflineOnline />
        {/* Header */}
        <div className='w-full shadow-xl font-bold text-[#009688] bg-white flex justify-center items-center p-6 sm:p-8'>
          <div className='text-3xl sm:text-4xl md:text-5xl font-semibold'>My Wallet</div>
        </div>

        {/* Total Points and Withdraw Section */}
        <div className='p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-12 items-start md:items-center'>
          <h2 className='text-2xl sm:text-3xl font-semibold text-[#009688]'>Total Points: {walletPoints}</h2>
          <button onClick={hanldeWithdraw} className='py-3 px-5 md:py-4 md:px-6 border rounded-lg bg-[#009688] hover:bg-[#FF7043] text-white transition-all ease-in-out duration-300 font-semibold text-lg sm:text-xl'>
            Withdraw
          </button>
        </div>

        {/* Points History Section */}
        <div className='p-4 sm:p-6 md:p-8'>
          <h2 className='text-2xl sm:text-3xl font-semibold text-[#009688] mb-4'>Points History</h2>
          <div className='bg-white p-4 rounded-lg shadow-md overflow-x-auto'>
            <ul className='w-full'>
              {walletTransactions.map((data, index) => (
                <li
                  key={index}
                  className='flex flex-col sm:flex-row sm:justify-between py-2 border-b text-sm sm:text-base'
                >
                  <span className={`font-medium ${data.transactionType === 'Added' ? 'text-[#4BB543]' : 'text-[#FC100D]'}`}>
                    {data.transactionType === 'Added'
                      ? `+${data.transactionAmount}`
                      : `- ${data.transactionAmount}`} points
                  </span>
                  {data.paid &&
                    <span><img src={paid} alt="paid" className='w-12'/></span>
                  }
                  <span className='text-gray-700'>{data.datetime}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showWithdrawMehtod &&
        <Withdraw
          onBackStep={handleOnBack}
          onCashPayment={handleCashWithdraw}
        />
      }


      {/* Withdraw ammount input files */}
      {showWithdrawAmountField &&
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
          <div className='text-xl font-bold text-gray-700 text-center mb-4'>Enter Withdraw Points</div>
            <div onClick={hanldeWalletClose} ><img src={close} alt="" className='absolute right-2 top-1 w-[24px] cursor-pointer' /></div>
          {/* Withdraw Input */}
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount"
            className='w-full p-2 mb-1 border rounded-md border-gray-300'
          />

          {/* Error Message */}
          {errorMessage && <p className='text-red-500 mb-2 text-sm'>{errorMessage}</p>}

          {/* Withdraw Button */}
          <button
            onClick={handleWithdrawPointsButton}
            className='w-full py-2 px-4  text-white rounded-lg bg-[#009688] hover:bg-[#FF7043] transition duration-200 ease-in-out'
          >
            Withdraw
          </button>
        </div>
      }


      {/* Transaction Complete receipt */}
      {showTransactionNotify &&
        <div className='fixed bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[70vw] md:w-[50vw] flex flex-col gap-4' >
          <div ref={captureRef} className='bg-white' >
            <div className='bg-[#009688] p-4 rounded-tr-lg rounded-tl-lg text-white w-full flex flex-col gap-4 justify-center items-center'>
              <div>Cash</div>
              <div className='font-semibold text-3xl'>Rs. {withdrawAmount}</div>
              <div className='text-center'>
                <div className='font-semibold'>{userData?.name}</div>
                <div>SwiftLogix</div>
              </div>
            </div>

            <div className='w-full  flex flex-col px-2'>
              <div className='font-semibold mb-1 text-lg'>Transaction Details</div>
              <div className='mb-1 flex justify-between'><div>Transaction ID</div><div>{transactionId}</div> </div>
              <div className='mb-1 flex justify-between'><div>Transaction Time</div><div>{transactionTime}</div> </div>
            </div>

            <div className='flex justify-center my-4'>
              <img src={tick} alt="tick" />
            </div>
          </div>

          <div className='flex justify-center gap-4'>
            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#009688] text-white py-2 px-6 rounded-full hover:bg-[#FF7043] transition duration-200 ease-in-out"
            >
              Save
            </button>
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleNotifyCancel}
              className="bg-[#FF7043] text-white py-2 px-6 rounded-full hover:bg-[#009688] transition duration-200 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </div>
      }


    </div >
  );

};

export default RiderWallet;

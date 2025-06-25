import React, { useState, useEffect } from 'react'
import { FaEdit, FaPlus, FaComments, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SidebarCustomer from './SidebarCustomer'
import MyProfileOTPCard from './MyProfileOTPCard';
import mail from './icons/email.png'
import mobile from './icons/mobile.png'
import password from './icons/password.png'
import profile from './icons/profile.png'
import address from './icons/address.png'
import card from './icons/card.png'
import _ from 'lodash';
import SwiftBot from './SwiftBot';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OfflineOnline from './OfflineOnline';

const CustomerProfile = () => {
  const [showEditIcon, setShowEditIcon] = useState(false)
  const [userData, setuserData] = useState(null)
  const navigate = useNavigate();
  const [showCnicField, setshowCnicField] = useState(false)
  const [showAddressField, setshowAddressField] = useState(false)
  const [customerCnic, setcustomerCnic] = useState(null)
  const [customerAddress, setcustomerAddress] = useState(null)
  const [editUserData, seteditUserData] = useState(null)
  const [refresh, setRefresh] = useState(false);
  const [otpCard, setOTPCard] = useState(false);
  const [otpVerified, setOTPVerified] = useState(false);
  const [isResponse, setIsResponse] = useState(true)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobileno: '',
    cnic: '',
    address: ''
  });


  const handleEdit = () => {
    seteditUserData((prevData) => ({
      ...prevData,
      password: '********'
    }));
    setShowEditIcon(true)
  }

  const validateEditData = () => {
    let valid = true;
    let newErrors = {};

    if (!editUserData.name) {
      newErrors.name = 'Name is required*';
      valid = false
    }
    else if (!/^[A-Za-z\s]+$/.test(editUserData.name)) {
      newErrors.name = 'Name must contain only alphabets';
      valid = false;
    }

    if (!editUserData.email) {
      newErrors.email = 'email is required*';
      valid = false
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(editUserData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!editUserData.mobileno) {
      newErrors.mobileno = 'Mobile no is required*';
      valid = false
    }
    else if (!/^[0-9]+$/.test(editUserData.mobileno)) {
      newErrors.mobileno = 'Mobile no must contain only digits';
      valid = false;
    }
    else if (editUserData.mobileno.length < 11) {
      newErrors.mobileno = 'Mobile no must be exactly 11 digits';
      valid = false;
    }

    if (!editUserData.password) {
      newErrors.password = 'Password is required*';
      valid = false
    }
    else if (editUserData.password.length < 8) {
      newErrors.password = 'Password contain minimum 8 characters';
      valid = false
    }

    if (!editUserData.cnic && userData.cnic !== null) {
      newErrors.cnic = 'CNIC is required*';
      valid = false
    }
    else if (!/^[0-9]{13}$/.test(editUserData.cnic) && userData.cnic !== null) {
      newErrors.cnic = 'CNIC must be exactly 13 digits';
      valid = false;
    }

    if (!editUserData.address && userData.address !== null) {
      newErrors.address = 'Address is required*';
      valid = false
    }

    setErrors(newErrors);
    return valid;
  }

  const handleSave = async () => {
    if (validateEditData()) {
      try {
        setIsResponse(false)
        const response = await fetch('http://localhost:3000/verifyedit-customer',
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ editUserData, sendEmail: userData?.email })
          }
        )

        if (!response.ok) {
          console.log('Error in response');
        }

        const result = await response.json();
        const newErrors = [];
        if (!result.success) {
          newErrors[result.name] = result.message;
          setErrors(newErrors);
          return
        }

        setOTPCard(true);

      } catch (error) {

      }

      setShowEditIcon(false)
    }

  }

  const saveEditDetails = async () => {
    try {
      const response = await fetch('http://localhost:3000/saveedit-customer',
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ editUserData })
        }
      )

      if (!response.ok) {
        console.log('Error in response');
      }

      const result = await response.json();

      if (result.success) {
        setIsResponse(true)
        setRefresh(!refresh);
        toast.success("Your profile has been updated successfully.");
      } else {
        setIsResponse(true);
        toast.error("Failed to update profile.")
      }
    } catch (error) {
      toast.error("Failed to update profile.")
    }
    setShowEditIcon(false)
  }


  const handleCancel = () => {
    seteditUserData(userData)
    setErrors({
      name: '',
      email: '',
      mobileno: '',
      cnic: '',
      address: ''
    });
    setShowEditIcon(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/customer-profile',
          { credentials: 'include' }
        );
        const result = await response.json();

        if (result.success) {
          setuserData(result.userData)
          seteditUserData(result.userData)
          return
        }

        navigate('/login')

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const showCnicInputFields = () => {
    setshowCnicField(true)
  }

  const showAddressInputFields = () => {
    setshowAddressField(true)
  }

  const hanldeChange = (e) => {
    const { name, value } = e.target;
    if (name == 'customerCnic') {
      setcustomerCnic(value);
    } else {
      setcustomerAddress(value);
    }
     setErrors({
      [name]: ''
    })
  }

  const handleChangeEditInfo = (e) => {
    const { name, value } = e.target;
    seteditUserData({
      ...editUserData,
      [name]: value
    })
    setErrors({
      [name]: ''
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/customer-profile',
          { credentials: 'include' }
        );
        const result = await response.json();

        if (result.success) {
          setuserData(result.userData)
          seteditUserData(result.userData)
          return
        }

        navigate('/login')

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refresh]);


  const saveCnic = async () => {
    let newErrors = {};

    if (!customerCnic) {
      newErrors.cnic = 'CNIC is required*';
      setErrors(newErrors)
      return
    }
    if (!/^[0-9]{13}$/.test(customerCnic)) {
      newErrors.cnic = 'CNIC must be exactly 13 digits';
      setErrors(newErrors)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/add-cnic',
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerCnic })
        }
      )

      if (!response.ok) {
        console.log('Error in response');
        return
      }

      const result = await response.json();
      const newError = []
      if (!result.success) {
        newError.cnic = result.message;
        setErrors(newError)
        toast.error("Failed to added CNIC.");
        return
      }

      setshowCnicField(false)
      setErrors(newError)
      setRefresh(!refresh);
      toast.success("Your CNIC has been added successfully.");

    } catch (error) {
      toast.error("Failed to added CNIC.");
    }

  }

  const saveAddress = async () => {
    try {
      let newErrors = {};

      if (!customerAddress) {
        newErrors.address = 'Address is required*';
        setErrors(newErrors)
        return
      }

      const response = await fetch('http://localhost:3000/add-address',
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerAddress })
        }
      )

      if (!response.ok) {
        console.log('Error in response');
        return
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Your address has been added successfully.");
        setshowAddressField(false)
        setRefresh(!refresh);
      }

      toast.error("Failed to added address.");

    } catch (error) {
      toast.error("Failed to added address.");
    }
  }

  return (
    <div className='flex flex-col min-[1226px]:flex-row min-h-screen'>
      <SidebarCustomer />
      <SwiftBot />
      <OfflineOnline />

      <div className='flex-1 min-[1226px]:ml-[18vw] w-screen'>
        <div className='w-full shadow-xl font-bold text-[#009688] bg-white flex justify-center items-center p-6 md:p-8'>
          <div className='text-3xl md:text-5xl font-semibold'>My Profile</div>
        </div>

        <div className='w-full flex justify-center mt-4 px-4'>
          <div className='w-full md:w-[60%] flex items-center justify-between p-4 border bg-[#009688] rounded-lg'>
            <div className='w-full flex items-center gap-4 flex-wrap'>
              <img src={profile} alt="" width={72} className='invert' />
              {showEditIcon ? (
                <input
                  onChange={handleChangeEditInfo}
                  autoFocus
                  type="text"
                  name='name'
                  value={editUserData?.name}
                  className='w-full bg-transparent text-[22px] md:text-[28px] font-semibold text-white focus:outline-none'
                />
              ) : (
                <p className="text-[22px] md:text-[28px] text-white font-bold">{userData?.name}</p>
              )}
            </div>
            {showEditIcon && <FaEdit size={24} className='cursor-pointer' />}
          </div>
        </div>

        {/* Error Name */}
        <div className='w-full flex justify-center'>
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
        </div>

        {/* Email & Mobile */}
        <div className='w-full flex flex-col md:flex-row gap-6 md:gap-8 mt-8 px-4 justify-center text-gray-700'>
          {[{ label: "Email", icon: mail, name: "email", value: editUserData?.email, error: errors.email, data: userData?.email },
          { label: "Mobile No", icon: mobile, name: "mobileno", value: editUserData?.mobileno, error: errors.mobileno, data: userData?.mobileno, maxLength: 11 }
          ].map((field, idx) => (
            <div key={idx} className='flex-1 flex items-center p-3 border rounded-lg bg-white'>
              <img src={field.icon} alt="" className='w-8 mr-3' />
              <div className='w-full'>
                <h1 className='font-bold text-lg'>{field.label}</h1>
                {showEditIcon ? (
                  <input
                    onChange={handleChangeEditInfo}
                    type="text"
                    name={field.name}
                    maxLength={field.maxLength || undefined}
                    value={field.value}
                    className='w-full focus:outline-none'
                  />
                ) : (
                  <p>{field.data}</p>
                )}
                {field.error && <p className="text-red-500 text-sm mt-1">{field.error}</p>}
              </div>
              {showEditIcon && <FaEdit size={24} className='cursor-pointer ml-2' />}
            </div>
          ))}
        </div>

        {/* Password & CNIC */}
        <div className='w-full flex flex-col md:flex-row gap-6 md:gap-8 mt-8 px-4 justify-center text-gray-700'>
          {/* Password */}
          <div className='flex-1 flex items-center p-3 border rounded-lg bg-white'>
            <img src={password} alt="" className='w-8 mr-3' />
            <div className='w-full'>
              <h1 className='font-bold text-lg'>Password</h1>
              {showEditIcon ? (
                <input
                  onChange={handleChangeEditInfo}
                  type="text"
                  name='password'
                  value={editUserData?.password}
                  className='w-full focus:outline-none'
                />
              ) : (
                <p className='overflow-hidden'>********</p>
              )}
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            {showEditIcon && <FaEdit size={24} className='cursor-pointer ml-2' />}
          </div>

          {/* CNIC */}
          <div className='flex-1 flex items-center p-3 border rounded-lg bg-white'>
            <img src={card} alt="Card" className='w-8 mr-3' />
            <div className='w-full'>
              <h1 className='font-bold text-lg'>CNIC</h1>
              <div className='flex gap-2 flex-wrap'>
                {showEditIcon && userData.cnic ? (
                  <input onChange={handleChangeEditInfo} type="text" name='cnic' value={editUserData?.cnic} maxLength={13} className='w-full focus:outline-none' />
                ) : (
                  <p>{userData?.cnic}</p>
                )}
                {showCnicField && (
                  <>
                    <input onChange={hanldeChange} maxLength={13} type="text" name='customerCnic' placeholder='Enter Cnic' value={customerCnic} className='focus:outline-none rounded-md pl-1' />
                    <FaCheck onClick={saveCnic} className='cursor-pointer text-[#FF7043]' />
                  </>
                )}
                {!showCnicField && !userData?.cnic && (
                  <>
                    <p onClick={showCnicInputFields} className='cursor-pointer'>Add</p>
                    <FaPlus onClick={showCnicInputFields} className='cursor-pointer' />
                  </>
                )}
                {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
              </div>
            </div>
            {showEditIcon && userData?.cnic && <FaEdit size={24} className='cursor-pointer ml-2' />}
          </div>
        </div>

        {/* Address */}
        <div className='w-full mt-8 px-4 flex flex-col items-center'>
          <div className='w-full md:w-[70%] flex items-center p-3 border rounded-lg bg-white'>
            <img src={address} alt="Address" className='w-8 mr-3' />
            <div className='w-full'>
              <h1 className='font-bold text-lg'>Address</h1>
              <div className='flex gap-2 flex-wrap'>
                {showEditIcon && userData.address ? (
                  <input onChange={handleChangeEditInfo} type="text" name='address' value={editUserData?.address} className='w-full focus:outline-none' />
                ) : (
                  <p>{userData?.address}</p>
                )}
                {showAddressField && (
                  <div className='w-full flex gap-2'>
                    <input onChange={hanldeChange} type="text" name='customerAddress' placeholder='Enter address' value={customerAddress} className='w-full focus:outline-none rounded-md pl-1' />
                    <FaCheck onClick={saveAddress} className='cursor-pointer text-[#FF7043]' />
                  </div>
                )}
                {!showAddressField && !userData?.address && (
                  <>
                    <p onClick={showAddressInputFields} className='cursor-pointer'>Add</p>
                    <FaPlus onClick={showAddressInputFields} className='cursor-pointer' />
                  </>
                )}
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
            {showEditIcon && userData?.address && <FaEdit size={24} className='cursor-pointer ml-2' />}
          </div>
        </div>

        {/* Buttons */}
        <div className='w-full flex flex-col md:flex-row justify-center items-center gap-4 mt-8 mb-12'>
          {!showEditIcon && (
            <div onClick={handleEdit} className='flex items-center gap-2 bg-[#009688] text-white px-6 py-3 rounded-lg cursor-pointer'>
              <FaEdit size={20} />
              <span>Edit</span>
            </div>
          )}
          {showEditIcon && (
            <>
              <div onClick={handleCancel} className='bg-[#FF7043] text-white px-6 py-3 rounded-lg cursor-pointer'>
                Cancel
              </div>
              <div onClick={handleSave} className='bg-[#009688] text-white px-6 py-3 rounded-lg cursor-pointer'>
                {isResponse ? 'Save' : 'Saving...'}
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer />

      {/* OTP CARD */}
      {otpCard && <MyProfileOTPCard oldemail={userData.email} email={editUserData.email} userId={userData?._id} setOTPCard={setOTPCard} setOTPVerified={setOTPVerified} saveeditDetails={saveEditDetails} />}
    </div>
  )

}

export default CustomerProfile

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaComments } from 'react-icons/fa';
import mail from './icons/email.png';
import mobile from './icons/mobile.png';
import password from './icons/password.png';
import profile from './icons/profile.png';
import address from './icons/address.png';
import card from './icons/card.png';
import vehicle from './icons/vehicle.png';
import SidebarRider from './SidebarRider';
import OfflineOnline from './OfflineOnline';

const RiderProfile = () => {
  const navigate = useNavigate();
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [userData, setuserData] = useState(null)
  const [editUserData, seteditUserData] = useState(null)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/rider-profile',
          { credentials: 'include' }
        );
        const result = await response.json();

        if (result.success) {
          setuserData(result.userData)
          seteditUserData(result.userData)
          return
        }

        navigate('/rider-login')

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const handleEdit = () => {
    setShowEditIcon(true);
  };

  const handleSave = () => {
    setShowEditIcon(false);
  };

  const handleCancel = () => {
    setShowEditIcon(false);
  };
  return (
    <div className="flex flex-col min-[1226px]:flex-row">
      <SidebarRider />

      <div className="min-[1226px]:ml-[18vw] w-full">
        <OfflineOnline />
        <div className="w-full shadow-xl font-bold text-[#009688] bg-white flex justify-center items-center p-8">
          <div className="text-3xl sm:text-4xl md:text-5xl font-semibold">My Profile</div>
        </div>

        {/* User Info */}
        <div className="w-full flex justify-center mt-4 px-4">
          <div className="w-full max-w-xl flex items-center justify-between p-4 border bg-[#009688] rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
              <img src={profile} alt="" width={64} className="invert" />
              <p className="text-xl sm:text-2xl md:text-[28px] text-white font-bold">{userData?.name}</p>
            </div>
            {showEditIcon && (
              <FaEdit size={24} className="cursor-pointer" />
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row gap-6 mt-10 px-4 justify-center">
          {[{
            icon: mail,
            title: 'Email',
            value: userData?.email
          }, {
            icon: mobile,
            title: 'Mobile No',
            value: userData?.mobileno
          }].map((item, i) => (
            <div key={i} className="w-full md:w-[40%] flex items-center p-4 justify-between rounded-lg border shadow-md">
              <div className="flex items-center gap-3">
                <img src={item.icon} alt="" className="w-[32px]" />
                <div>
                  <h1 className="font-bold text-lg">{item.title}</h1>
                  <p>{item.value}</p>
                </div>
              </div>
              {showEditIcon && (
                <FaEdit size={24} className="cursor-pointer" />
              )}
            </div>
          ))}
        </div>

        {/* Password & CNIC */}
        <div className="flex flex-col md:flex-row gap-6 mt-10 px-4 justify-center">
          <div className="w-full md:w-[40%] flex items-center p-4 justify-between rounded-lg border shadow-md">
            <div className="flex items-center gap-3">
              <img src={password} alt="" className="w-[32px]" />
              <div>
                <h1 className="font-bold text-lg">Password</h1>
                <p>********</p>
              </div>
            </div>
            {showEditIcon && (
              <FaEdit size={24} className="cursor-pointer" />
            )}
          </div>
          <div className="w-full md:w-[40%] flex items-center p-4 gap-3 rounded-lg border shadow-md">
            <img src={card} alt="Card" className="w-[32px]" />
            <div>
              <h1 className="font-bold text-lg">CNIC</h1>
              <p>{userData?.cnic}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col items-center mt-10 px-4">
          <div className="w-full max-w-2xl flex items-center p-4 gap-3 rounded-lg border shadow-md">
            <img src={address} alt="Address" className="w-[32px]" />
            <div>
              <h1 className="font-bold text-lg">Address</h1>
              <p>{userData?.address}</p>
            </div>
            {showEditIcon && (
              <FaEdit size={24} className="cursor-pointer ml-auto" />
            )}
          </div>
        </div>

        {/* Vehicle Info Header */}
        <div className="text-center mt-10 text-[#009688] font-bold text-2xl sm:text-3xl">
          Vehicle Information
        </div>

        {/* Vehicle Info */}
        <div className="mb-10 flex flex-col md:flex-row gap-6 mt-6 px-4 justify-center flex-wrap">
          {[{
            title: 'Vehicle Type',
            value: userData?.vehicleType
          }, {
            title: 'Vehicle Make',
            value: userData?.vehicleMake
          }, {
            title: 'Vehicle Model',
            value: userData?.vehicleModel
          }, {
            title: 'License Plate',
            value: userData?.vehicleNumberPlate
          }].map((item, i) => (
            <div key={i} className="w-full md:w-[40%] flex items-center p-4 justify-between rounded-lg border shadow-md">
              <div className="flex items-center gap-3">
                <img src={vehicle} alt="Vehicle" className="w-[32px]" />
                <div>
                  <h1 className="font-bold text-lg">{item.title}</h1>
                  <p>{item.value}</p>
                </div>
              </div>
              {showEditIcon && (
                <FaEdit size={24} className="cursor-pointer" />
              )}
            </div>
          ))}
        </div>

        {/* Buttons
        <div className="flex my-12 justify-center">
          <div className="flex md:flex-row flex-col flex-wrap gap-4 px-4">
            {!showEditIcon && (
              <div onClick={handleEdit} className="font-semibold flex gap-2 cursor-pointer text-white bg-[#009688] py-3 px-4 rounded-lg">
                <FaEdit size={24} />
                <button>Edit</button>
              </div>
            )}
            {showEditIcon && (
              <>
                <div onClick={handleCancel} className="font-semibold flex gap-2 cursor-pointer text-white bg-[#FF7043] py-3 px-4 rounded-lg">
                  <button>Cancel</button>
                </div>
                <div onClick={handleSave} className="font-semibold md:mb-0 mb-10 flex gap-2 cursor-pointer text-white bg-[#009688] py-3 px-4 rounded-lg">
                  <button>Save</button>
                </div>
              </>
            )}
          </div>
        </div> */}
      </div>


    </div>
  );

};

export default RiderProfile;

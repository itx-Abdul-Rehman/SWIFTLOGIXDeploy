import React, { useState, useEffect } from 'react';
import { FaPrint, FaFilter } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import ShipmentCard from './ShipmentCard.jsx';
import tick from './icons/tick.svg';
import AdminShipmentDetails from './AdminShipmentDetails.jsx';
import RiderPickShipmentsInfo from './RiderPickShipmentsInfo.jsx';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import OfflineOnline from './OfflineOnline.jsx';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminShipments = () => {
  const navigate = useNavigate();
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [allShipments, setallShipments] = useState([]);
  const [allShipmentsCopies, setallShipmentsCopies] = useState([]);
  const [pendingShipmentsCount, setpendingShipmentsCount] = useState(null);
  const [completedShipmentsCount, setcompletedShipmentsCount] = useState(null);
  const [scheduledShipmentsCount, setscheduledShipmentsCount] = useState(null);
  const [acceptedShipmentsCount, setacceptedShipmentsCount] = useState(null);
  const [droppedShipmentIndex, setDroppedShipmentIndex] = useState(null)
  const [shipmentStatusUpdated, setShipmentStatusUpdated] = useState(false)
  const [shipmentStatusMessage, setshipmentStatusMessage] = useState(null)
  const [searchTrackingId, setsearchTrackingId] = useState(null)
  const [error, seterror] = useState(null)
  const [userData, setuserData] = useState({})
  const [showFilter, setShowFilter] = useState(false)
  const [isSelectPickByRider, setIsSelectPickByRider] = useState(false);
  const [showEmailNotification, setShowEmailNotification] = useState(false)
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [processingIndex, setProcessingIndex] = useState(null)
  const pdfRef = useRef();

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(formatted);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {

        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3000/admin', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.log('Response error')
        }
        const result = await response.json();
        if (!result.success) {
          navigate('/admin-login')
        }

        setuserData(result.userData);


      } catch (err) {

      }
    }

    fetchData()
  }, [])

  //here get selected shipments like pending,completed or scheduled from servers/database
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/get-city-shipments',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedCard, city: userData?.city })
        }
      )
      if (!response.ok) {
        console.log('response error');
      }

      const result = await response.json();
      const shipments = result.shipments;
      console.log(shipments)
      if (shipments.length > 0 && result.showRider === false) {
        // Map over all shipments and store them
        const formattedShipments = shipments.map(shipment => ({
          packagePrice: {
            service: shipment.shipmentType,
            basePrice: shipment.basePrice,
            weightCharges: shipment.weightCharges,
            distanceCharges: shipment.distanceCharges,
            totalPrice: shipment.totalPrice,
            insurance: shipment.insurance
          },
          senderFormData: {
            sendername: shipment.sendername,
            sendercontact: shipment.sendercontact,
            senderemail: shipment.senderemail,
            sendercnic: shipment.sendercnic
          },
          receiverFormData: {
            receivername: shipment.receivername,
            receivercontact: shipment.receivercontact,
            receiveremail: shipment.receiveremail,
            receivercnic: shipment.receivercnic,
            receiverarea: shipment.receiverarea,
            receiverhouseno: shipment.receiverhouseno,
            receiveraddress: shipment.receiveraddress
          },
          packageFormData: {
            originCity: shipment.originCity,
            destinationCity: shipment.destinationCity,
            weight: shipment.weight,
            pieces: shipment.pieces,
            pickupdate: shipment.pickupdate || '',
            pickuptime: shipment.pickuptime || '',
            insurance: shipment.insurance,
            pickupaddress: shipment.pickupaddress || '',
            shipmentType: shipment.shipmentType,
            deliveryMethod: shipment.deliveryMethod,
            sensitivePackage: shipment.sensitivePackage,
            packageDescription: shipment.packageDescription,
            shipmentStatus: shipment.shipmentStatus,
            deliveryDate: shipment.deliveryDate || ''
          },
          paymentMethod: {
            paymentMethod: shipment.paymentMethod,
          },
          scheduleTime: {
            scheduleTime: shipment.datetime,
          },
          trackingId: {
            trackingId: shipment.trackingid
          }

        }));
        setallShipments(formattedShipments);
        setallShipmentsCopies(formattedShipments)
      } else if (shipments.length > 0 && result.showRider === true) {
        // Map over all shipments and store them
        const formattedShipments = shipments.map(shipment => ({
          packagePrice: {
            service: shipment.shipment.shipmentType,
            basePrice: shipment.shipment.basePrice,
            weightCharges: shipment.shipment.weightCharges,
            distanceCharges: shipment.shipment.distanceCharges,
            totalPrice: shipment.shipment.totalPrice,
            insurance: shipment.shipment.insurance
          },
          senderFormData: {
            sendername: shipment.shipment.sendername,
            sendercontact: shipment.shipment.sendercontact,
            senderemail: shipment.shipment.senderemail,
            sendercnic: shipment.shipment.sendercnic
          },
          receiverFormData: {
            receivername: shipment.shipment.receivername,
            receivercontact: shipment.shipment.receivercontact,
            receiveremail: shipment.shipment.receiveremail,
            receivercnic: shipment.shipment.receivercnic,
            receiverarea: shipment.shipment.receiverarea,
            receiverhouseno: shipment.shipment.receiverhouseno,
            receiveraddress: shipment.shipment.receiveraddress
          },
          packageFormData: {
            originCity: shipment.shipment.originCity,
            destinationCity: shipment.shipment.destinationCity,
            weight: shipment.shipment.weight,
            pieces: shipment.shipment.pieces,
            pickupdate: shipment.shipment.pickupdate || '',
            pickuptime: shipment.shipment.pickuptime || '',
            insurance: shipment.shipment.insurance,
            pickupaddress: shipment.shipment.pickupaddress || '',
            shipmentType: shipment.shipment.shipmentType,
            deliveryMethod: shipment.shipment.deliveryMethod,
            sensitivePackage: shipment.shipment.sensitivePackage,
            packageDescription: shipment.shipment.packageDescription,
            shipmentStatus: shipment.shipment.shipmentStatus,
            deliveryDate: shipment.shipment.deliveryDate || ''
          },
          paymentMethod: {
            paymentMethod: shipment.shipment.paymentMethod,
          },
          scheduleTime: {
            scheduleTime: shipment.shipment.datetime,
          },
          trackingId: {
            trackingId: shipment.shipment.trackingid
          },
          rider: {
            name: shipment.rider.name,
            email: shipment.rider.email,
            mobileno: shipment.rider.mobileno,
            cnic: shipment.rider.cnic
          }

        }));
        setallShipments(formattedShipments);
        setallShipmentsCopies(formattedShipments)
      } else {
        setallShipments([]);
      }

    }
    setIsSelectPickByRider(false)
    setShowFilter(false)
    fetchData()
  }, [selectedCard, userData])

  //here count shipments completed
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/get-city-shipments',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedCard: 'completed', city: userData?.city })
        }
      )
      if (!response.ok) {
        console.log('response error');
      }

      const result = await response.json();
      setcompletedShipmentsCount(result.shipments.length);

    }

    fetchData()
  }, [userData])

  //here count shipments scheduled
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/get-city-shipments',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedCard: 'scheduled', city: userData?.city })
        }
      )
      if (!response.ok) {
        console.log('response error');
      }

      const result = await response.json();
      setscheduledShipmentsCount(result.shipments.length);

    }

    fetchData()
  }, [userData])

  //here count shipments pending
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/get-city-shipments',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedCard: 'pending', city: userData?.city })
        }
      )
      if (!response.ok) {
        console.log('response error');
      }

      const result = await response.json();
      setpendingShipmentsCount(result.shipments.length);

    }

    fetchData()
  }, [userData])

  //here count shipments accepted
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/get-city-shipments',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedCard: 'accepted', city: userData?.city })
        }
      )
      if (!response.ok) {
        console.log('response error');
      }

      const result = await response.json();
      setacceptedShipmentsCount(result.shipments.length);

    }

    fetchData()
  }, [userData])


  //only one time run when click on shipment and set default scheduled shipments shows
  useEffect(() => {
    setSelectedCard('scheduled')
  }, [])


  const handleCardClick = (card) => {
    setSelectedCard(card);
    // Toggle the background color based on the clicked card
    if (card === 'scheduled') {
      document.documentElement.classList.add('bg-[#009688]');
      document.documentElement.classList.remove('bg-white');
    } else {
      document.documentElement.classList.remove('bg-[#009688]');
      document.documentElement.classList.add('bg-white');
    }
  }


  const waitforsecond = () => {
    setTimeout(() => {
      setShipmentStatusUpdated(false);
      setshipmentStatusMessage(null);
      window.location.reload();
    }, 1000);
  }

  //here handle dropped shipments
  const handleDroppedShipments = async (index) => {
    try {
      setProcessingIndex(index)
      const response = await fetch('http://localhost:3000/dropped-shipment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(allShipments[index])
        }
      )

      if (!response.ok) {
        console.log('Response error')
        return
      }

      const result = await response.json();

      // setShipmentStatusUpdated(!shipmentStatusUpdated)
      // setshipmentStatusMessage(result.message)
      // waitforsecond();
      setProcessingIndex(null)
      toast.success('Shipment status updated')
      window.location.reload()

    } catch (error) {

    }
  }

  const pickedShipment = async (index) => {
    try {
      const now = new Date();
      // Format to DD-MM-YYYY
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const currentDate = `${day}-${month}-${year}`;

      if (!(currentDate === allShipments[index].packageFormData.deliveryDate)) {
        toast.error('Please note that pick shipment only the shipment delivery date.')
        return
      }
      setProcessingIndex(index)
      const response = await fetch("http://localhost:3000/rider-picked",
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(allShipments[index])
        }
      )

      if (!response.ok) {
        console.log('Response error')
      }

      const result = await response.json()

      // setShipmentStatusUpdated(!shipmentStatusUpdated)
      // setshipmentStatusMessage(result.message)
      // waitforsecond();
      setProcessingIndex(null)
      toast.success('Shipment status updated')
      window.location.reload()
    } catch (error) {

    }
  }


  const hanldeChange = (e) => {
    const trackingId = e.target.value;
    setsearchTrackingId(trackingId);
    setallShipments(allShipmentsCopies)
    seterror('')
  }

  const handleSeacrh = async () => {
    seterror('')
    if ((searchTrackingId.length == 0)) {
      seterror('Tracking Id required*')
      return
    }
    const searchedShipment = allShipments.find(shipment => shipment.trackingId.trackingId === searchTrackingId);
    if (!searchedShipment) {
      seterror('No, shipment found.')
      return
    }
    setallShipments([searchedShipment]);
  }


  const handleFilterShow = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowFilter(!showFilter);
    setIsSelectPickByRider(false);
    setSelectedCard('scheduled');
    setallShipments(allShipmentsCopies)
  }

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(formatted);
  }


  const handleFilterPickByRider = async (date, time) => {
    try {
      setIsSelectPickByRider(true)
      const response = await fetch('http://localhost:3000/get-shipment-pickbyrider',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deliveryMethod: 'pickUpRider', date: date, time: time })
        }
      );

      if (!(response.ok)) {
        console.log('Response error')
      }

      const result = await response.json();
      const shipments = result.shipments;
      if (result.success) {
        if (shipments.length) {
          // Map over all shipments and store them
          const formattedShipments = shipments.map(shipment => ({
            packagePrice: {
              service: shipment.shipmentType,
              basePrice: shipment.basePrice,
              weightCharges: shipment.weightCharges,
              distanceCharges: shipment.distanceCharges,
              totalPrice: shipment.totalPrice,
              insurance: shipment.insurance
            },
            senderFormData: {
              sendername: shipment.sendername,
              sendercontact: shipment.sendercontact,
              senderemail: shipment.senderemail,
              sendercnic: shipment.sendercnic
            },
            receiverFormData: {
              receivername: shipment.receivername,
              receivercontact: shipment.receivercontact,
              receiveremail: shipment.receiveremail,
              receivercnic: shipment.receivercnic,
              receiverarea: shipment.receiverarea,
              receiverhouseno: shipment.receiverhouseno,
              receiveraddress: shipment.receiveraddress
            },
            packageFormData: {
              originCity: shipment.originCity,
              destinationCity: shipment.destinationCity,
              weight: shipment.weight,
              pieces: shipment.pieces,
              pickupdate: shipment.pickupdate || '',
              pickuptime: shipment.pickuptime || '',
              insurance: shipment.insurance,
              pickupaddress: shipment.pickupaddress || '',
              shipmentType: shipment.shipmentType,
              deliveryMethod: shipment.deliveryMethod,
              sensitivePackage: shipment.sensitivePackage,
              packageDescription: shipment.packageDescription,
              shipmentStatus: shipment.shipmentStatus,
              payby: shipment.payby,
              paid: shipment.paid
            },
            paymentMethod: {
              paymentMethod: shipment.paymentMethod,
            },
            scheduleTime: {
              scheduleTime: shipment.datetime,
            },
            trackingId: {
              trackingId: shipment.trackingid
            }

          }));
          setallShipments(formattedShipments);
        }
      } else {
        setallShipments([])
      }

    } catch (error) {

    }
  }

  const waitforSecondEmailNotification = () => {
    setTimeout(() => {
      setShowEmailNotification(false)
    }, 2000);
  }

  const sendEmailNotification = async () => {
    try {
      const response = await fetch('http://localhost:3000/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allShipments)
      });

      if (!response.ok) {
        console.log('Response error')
      }

      const result = await response.json();
      if (result.success) {
        setShowEmailNotification(true)
        waitforSecondEmailNotification()
      } else {

      }

    } catch (error) {

    }
  }


  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(event.target.value);
    handleFilterPickByRider(date, selectedTime)
  };

  const handleTimeChange = (event) => {
    const time = event.target.value;
    setSelectedTime(event.target.value);
    handleFilterPickByRider(selectedDate, time);
  };

  const handlePrintDownload = () => {
    const element = pdfRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'shipments.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1024,
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        after: '.page-break',
        avoid: ['.no-break']
      }
    };

    html2pdf().set(opt).from(element).save();
  }



  return (
    <div className="flex">

      {/* Left Sidebar */}
      <AdminSidebar />
      <ToastContainer />

      {/* Success Card */}
      {shipmentStatusUpdated && (
        <div className='w-full flex justify-center items-center fixed top-0 left-0 h-screen bg-black bg-opacity-50 z-50'>
          <div className='w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] rounded-3xl shadow-2xl bg-white p-5 flex flex-col items-center relative transition-all duration-300'>
            <img src={tick} alt="Success" className='w-20   shadow-2xl rounded-full absolute -top-9' />
            <p className='mt-10   text-center text-xl sm:text-[36px] text-gray-700 font-semibold'>
              {shipmentStatusMessage}
            </p>
          </div>
        </div>
      )}



      {/* Right Content Area */}
      <div className="flex-1 w-full min-[1226px]:ml-[18vw] h-screen bg-white overflow-y-auto relative">
        <OfflineOnline />
        {/* Header */}
        <div className='w-full shadow-xl font-bold text-[#009688] bg-white flex justify-center items-center p-8'>
          <div className='text-5xl font-semibold'>Shipments</div>
        </div>

        {/* Dashboard Cards */}
        <div className='relative'>
          <div className='flex gap-6 p-8'>
            <DashboardCard
              title="Completed Shipments"
              value={completedShipmentsCount}
              onClick={() => handleCardClick('completed')}
              isSelected={selectedCard === 'completed'}
            />
            <DashboardCard
              title="Scheduled Shipments"
              value={scheduledShipmentsCount}
              onClick={() => handleCardClick('scheduled')}
              isSelected={selectedCard === 'scheduled'}
            />
            <DashboardCard
              title="Accepted Shipments"
              value={acceptedShipmentsCount}
              onClick={() => handleCardClick('accepted')}
              isSelected={selectedCard === 'accepted'}
            />
            <DashboardCard
              title="Pending Shipments"
              value={pendingShipmentsCount}
              onClick={() => handleCardClick('pending')}
              isSelected={selectedCard === 'pending'}
            />

            {/* Search field */}
            <div className={`absolute ${selectedCard === 'scheduled' ? 'bottom-5' : 'bottom-[-37px]'}   text-center right-4 max-sm:top-[13rem]  sm:right-10 md:right-16 p-2 bg-white rounded-lg w-[90%] sm:w-auto`}>
              {/* Error message appears above the search bar */}
              {error && (
                <div className="text-red-600 mb-2 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Tracking ID"
                  value={searchTrackingId}
                  name="searchTrackingId"
                  onChange={hanldeChange}
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009688] w-full sm:w-auto"
                />
                <button
                  onClick={handleSeacrh}
                  className="bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] w-full sm:w-auto"
                >
                  Search
                </button>
              </div>

            </div>



          </div>


          {/* Filter Button */}
          {selectedCard === 'scheduled' && (
            <div className="px-4 sm:px-6 md:px-8 pb-4 flex items-start gap-4 relative max-sm:absolute max-sm:top-[20rem]">
              {/* Filter Button and Dropdown */}
              <div className="relative">
                <div
                  onClick={handleFilterShow}
                  className={`inline-flex items-center gap-1 cursor-pointer py-2 px-3 font-semibold rounded-full border ${showFilter ? 'border-[#009688]' : ''}`}
                >
                  <FaFilter size={24} color={showFilter ? '#009688' : '#FF7043'} />
                  <p>Filter</p>
                </div>

                {/* Dropdown */}
                {showFilter && (
                  <div className="absolute top-full mt-2 left-0 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[22vw] xl:w-[18vw] min-w-[180px] max-w-[240px] flex flex-col items-center shadow-lg rounded-lg p-3 border bg-white z-30">
                    <div
                      onClick={() => handleFilterPickByRider(selectedDate, selectedTime)}
                      className={`${isSelectPickByRider ? 'bg-[#009688] text-white px-6' : ''} cursor-pointer p-1 rounded-md hover:text-white hover:bg-[#009688] w-full text-center`}
                    >
                      Pick By Rider
                    </div>

                    {isSelectPickByRider && (
                      <>
                        <div className="w-full mt-2">
                          <input
                            type="date"
                            id="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full border rounded px-2 py-1"
                          />
                        </div>

                        {selectedDate && (
                          <div className="w-full mt-2">
                            <select
                              id="time"
                              name="time"
                              value={selectedTime}
                              onChange={handleTimeChange}
                              className="block w-full px-4 py-2 border rounded"
                              required
                            >
                              <option value="" disabled>Time</option>
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="12:00 PM">12:00 PM</option>
                              <option value="01:00 PM">01:00 PM</option>
                              <option value="02:00 PM">02:00 PM</option>
                              <option value="03:00 PM">03:00 PM</option>
                              <option value="04:00 PM">04:00 PM</option>
                              <option value="05:00 PM">05:00 PM</option>
                            </select>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Icons (Always fixed position right of filter) */}
              {isSelectPickByRider && allShipments.length > 0 && showFilter && (
                <div className="flex items-center gap-4 mt-[10px] z-50">
                  <FaPrint
                    onClick={handlePrintDownload}
                    size={24}
                    color="#009688"
                    className="cursor-pointer hover:opacity-80"
                  />
                  <MdNotifications
                    onClick={sendEmailNotification}
                    size={24}
                    color="#009688"
                    className="cursor-pointer hover:opacity-80"
                  />
                </div>
              )}
            </div>

          )}
        </div>

        {/* Send mail notification */}
        {showEmailNotification &&
          <div className='border-none bg-[#009688] text-white w-60 p-4 absolute bottom-8 right-4  bg-opacity-3 backdrop-blur-lg '>
            Successfully sent notification
          </div>
        }

        {
          allShipments.length == 0 &&
          <div className='flex justify-center items-center'>No, {selectedCard} shipments</div>
        }

        {/* Shipments List */}
        <div className={`flex flex-wrap gap-4 max-sm:mt-40 max-sm:px-4 sm:pl-8 ${selectedCard !== 'scheduled' && 'mt-12  max-sm:mt-24'}`}>
          {allShipments.map((data, index) => (
            <ShipmentCard
              key={index}
              trackingNumber={data.trackingId.trackingId}
              originCity={data.packageFormData.originCity}
              destinationCity={data.packageFormData.destinationCity}
              receiverName={data.receiverFormData.receivername}
              datetime={data.scheduleTime.scheduleTime}
              onClick={() => setSelectedShipment(index)}
              droppedButtonShow={true}
              handleDroppedShipments={() => handleDroppedShipments(index)}
              shipmentStatus={data.packageFormData.shipmentStatus}
              selectedCard={selectedCard}
              onClickPick={() => pickedShipment(index)}
              deliveryDate={data.packageFormData.deliveryDate}
              processingIndex={processingIndex}
              index={index}
            />
          ))}
        </div>

        {/* Show Shipment details if a shipment is selected */}
        {selectedShipment !== null && selectedShipment !== undefined && (
          <div className="absolute top-0 w-full h-auto bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <AdminShipmentDetails
              senderFormData={allShipments[selectedShipment].senderFormData}
              receiverFormData={allShipments[selectedShipment].receiverFormData}
              packageFormData={allShipments[selectedShipment].packageFormData}
              packagePrice={allShipments[selectedShipment].packagePrice}
              riderInfo={allShipments[selectedShipment].rider}
            />
            <button
              onClick={() => setSelectedShipment(null)}
              className="fixed top-4 right-10 text-[#FF7043] text-[44px]"
            >
              ×
            </button>
          </div>
        )}


      </div>

      {isSelectPickByRider && allShipments.length > 0 && (
        <div className="fixed top-0 left-full transition-transform duration-300 z-50">
          <RiderPickShipmentsInfo allShipments={allShipments} pdfRef={pdfRef} />
        </div>
      )}
    </div >
  );
}


// Dashboard card component
function DashboardCard({ title, value, onClick, isSelected }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-6 hover:bg-[#009688] rounded-lg shadow-md ${isSelected ? 'bg-[#009688] text-white' : 'bg-white'} text-gray-700 hover:text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default AdminShipments;

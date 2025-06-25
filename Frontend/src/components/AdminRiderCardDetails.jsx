import { FiDownload, FiEye } from "react-icons/fi";
import mail from './icons/email.png';
import mobile from './icons/mobile.png';
import address from './icons/address.png';
import card from './icons/card.png';
import vehicle from './icons/vehicle.png';
import OfflineOnline from "./OfflineOnline";

const AdminRiderCardDetails = ({ riderData, onAccept, onReject, selectedCard }) => {
    return (
        <div className="w-full mt-6 mb-10 px-4">
            <OfflineOnline />
            <div className="w-full">
                
                <div className="absolute top-6 right-24">
                    {riderData?.datetime}
                </div>

                {/* User Info */}
                <div className="w-full flex justify-center mt-4 px-4">
                    <div className="w-full max-w-xl flex items-center justify-between p-4 border bg-[#009688] rounded-lg shadow-lg">
                        <div className="flex items-center gap-4">
                            <img
                                src={riderData?.picture}
                                alt=""
                                width={64}
                                height={64}
                                className="rounded-full object-cover"
                            />
                            <p className="text-xl sm:text-2xl md:text-[28px] text-white font-bold">
                                {riderData?.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col md:flex-row gap-6 mt-10 px-4 justify-center">
                    {[{
                        icon: mail,
                        title: 'Email',
                        value: riderData?.email
                    }, {
                        icon: mobile,
                        title: 'Mobile No',
                        value: riderData?.mobileno
                    }].map((item, i) => (
                        <div key={i} className="w-full md:w-[40%] flex items-center p-4 justify-between rounded-lg border shadow-md">
                            <div className="flex items-center gap-3">
                                <img src={item.icon} alt="" className="w-[32px]" />
                                <div>
                                    <h1 className="font-bold text-lg">{item.title}</h1>
                                    <p>{item.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Password & CNIC */}
                <div className="flex flex-col md:flex-row gap-6 mt-10 px-4 justify-center">
                    <div className="w-full md:w-[40%] flex items-center p-4 justify-between rounded-lg border shadow-md">
                        <div className="flex items-center gap-3">
                            <img src={card} alt="Card" className="w-[32px]" />
                            <div>
                                <h1 className="font-bold text-lg">CNIC</h1>
                                <p>{riderData?.cnic}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-[40%] flex items-center p-4 gap-3 rounded-lg border shadow-md">
                        <img src={card} alt="Card" className="w-[32px]" />
                        <div>
                            <h1 className="font-bold text-lg">Date of Birth</h1>
                            <p>{riderData?.dateofbirth}</p>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="flex flex-col items-center mt-10 px-4">
                    <div className="w-full max-w-2xl flex items-center p-4 gap-3 rounded-lg border shadow-md">
                        <img src={address} alt="Address" className="w-[32px]" />
                        <div>
                            <h1 className="font-bold text-lg">Address</h1>
                            <p>{riderData?.address}</p>
                        </div>
                    </div>
                </div>

                {/* Vehicle Info Header */}
                <div className="text-center mt-10 text-[#009688] font-bold text-2xl sm:text-3xl">
                    Vehicle Information
                </div>

                {/* Vehicle Info */}
                <div className="flex flex-col md:flex-row gap-6 mt-6 px-4 justify-center flex-wrap">
                    {[{
                        title: 'Vehicle Type',
                        value: riderData?.vehicleType
                    }, {
                        title: 'Vehicle Make',
                        value: riderData?.vehicleMake
                    }, {
                        title: 'Vehicle Model',
                        value: riderData?.vehicleModel
                    }, {
                        title: 'License Plate',
                        value: riderData?.vehicleNumberPlate
                    }].map((item, i) => (
                        <div key={i} className="w-full md:w-[40%] flex items-center p-4 justify-between rounded-lg border shadow-md">
                            <div className="flex items-center gap-3">
                                <img src={vehicle} alt="Vehicle" className="w-[32px]" />
                                <div>
                                    <h1 className="font-bold text-lg">{item.title}</h1>
                                    <p>{item.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Documents Section */}
                <div className="w-full flex flex-col gap-6 mt-6 px-4 justify-center flex-wrap">
                    {[{
                        title: 'Driving License',
                        front: riderData?.drivingLicenseFront,
                        back: riderData?.drivingLicenseBack
                    }, {
                        title: 'Vehicle Card',
                        front: riderData?.vehicleCardFront,
                        back: riderData?.vehicleCardBack
                    }, {
                        title: 'National Identity Card (CNIC)',
                        front: riderData?.cnicFront,
                        back: riderData?.cnicBack
                    }].map((item, index) => (
                        <div key={index} className="w-full flex flex-col p-4 rounded-lg border shadow-md">
                            <h1 className="font-bold text-lg mb-4">{item.title}</h1>
                            <div className="w-full flex flex-wrap gap-4 justify-around">
                                {/* Front */}
                                <div className="flex flex-col items-center gap-2">
                                    <img
                                        src={item.front}
                                        alt={`${item.title} Front`}
                                        className="w-40 h-40 rounded-md border object-cover"
                                    />
                                    <div className="flex gap-3">
                                        <a
                                            href={item.front}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`${item.title} Front`}
                                        >
                                            <FiEye size={20} className="cursor-pointer" />
                                        </a>
                                        <a
                                            href={
                                                item.front
                                                    ? item.front.replace('/upload/', '/upload/fl_attachment/')
                                                    : '#'
                                            }
                                            download={`${item.title.replace(' ', '').toLowerCase()}Front-${riderData?.cnic}.jpg`}
                                            title={`Download ${item.title} Front`}
                                        >
                                            <FiDownload size={20} className="cursor-pointer" />
                                        </a>
                                    </div>
                                </div>

                                {/* Back */}
                                <div className="flex flex-col items-center gap-2">
                                    <img
                                        src={item.back}
                                        alt={`${item.title} Back`}
                                        className="w-40 h-40 rounded-md border object-cover"
                                    />
                                    <div className="flex gap-3">
                                        <a
                                            href={item.back}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`${item.title} Back`}
                                        >
                                            <FiEye size={20} className="cursor-pointer" />
                                        </a>
                                        <a
                                            href={
                                                item.back
                                                    ? item.back.replace('/upload/', '/upload/fl_attachment/')
                                                    : '#'
                                            }
                                            download={`${item.title.replace(' ', '').toLowerCase()}Back-${riderData?.cnic}.jpg`}
                                            title={`Download ${item.title} Back`}
                                        >
                                            <FiDownload size={20} className="cursor-pointer" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Footer Buttons */}
                    {/* <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
                        {selectedCard === 'pending' &&
                            <div className='w-full flex justify-center gap-2'>
                                <button onClick={onReject} className={`bg-[#FF7043] text-white px-4 py-2 rounded-lg hover:bg-[#009688] transition-all duration-300 text-sm sm:text-base`}>
                                    Reject
                                </button>
                                 <button onClick={onAccept} className={`bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#FF7043] transition-all duration-300 text-sm sm:text-base`}>
                                    Accept
                                </button>
                            </div>
                        }


                    </div> */}
                </div>

            </div>
        </div>
    );
};

export default AdminRiderCardDetails;

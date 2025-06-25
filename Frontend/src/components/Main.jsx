import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import bg_home from './icons/bg-home.jpg';
import FadeInSection from './FadeInSection';


const Main = () => {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState('');
    const [error, setError] = useState(null);
    const typedRef = useRef(null);
    const [placeholder, setPlaceholder] = useState('');
    const indexRef = useRef(0);
    const charIndexRef = useRef(0);
    const isDeletingRef = useRef(false);
    const delayRef = useRef(null);
     const [isResponse,setIsResponse]=useState('idle')
    const placeholderStrings = ['Live-Track your Shipment', 'Enter Tracking ID'];

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
            strings: ['Track. Secure. Deliver.', 'From Click to Confirmation, SwiftLogix Delivers.'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            className: ['text-lg']
        });

        return () => typed.destroy();
    }, []);

    useEffect(() => {
        const type = () => {
            const currentString = placeholderStrings[indexRef.current];
            const isDeleting = isDeletingRef.current;

            if (isDeleting) {
                charIndexRef.current--;
                setPlaceholder(currentString.substring(0, charIndexRef.current));
            } else {
                charIndexRef.current++;
                setPlaceholder(currentString.substring(0, charIndexRef.current));
            }

            if (!isDeleting && charIndexRef.current === currentString.length) {
                isDeletingRef.current = true;
                delayRef.current = setTimeout(type, 1000); 
                return;
            } else if (isDeleting && charIndexRef.current === 0) {
                isDeletingRef.current = false;
                indexRef.current = (indexRef.current + 1) % placeholderStrings.length;
            }

            delayRef.current = setTimeout(type, isDeleting ? 60 : 100);
        };

        type(); 

        return () => clearTimeout(delayRef.current); 
    }, []);

    const handleInput = (e) => {
        setError('');
        setTrackingId(e.target.value);
    };

    const hanldeSubmit = async () => {
        if (!trackingId) {
            setError('Tracking Id is required*');
            return;
        }

        try {
            setIsResponse('processing')
            const response = await fetch("http://13.203.194.4:3000/track-shipment", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId })
            });

            const result = await response.json();

            if (result.success) {
                setIsResponse('success')
                navigate('/track-shipment', {
                    state: {
                        shipmentDetail: result.shipmentDetail,
                        originCityCoords: result.originCityCoords,
                        destinationCityCoords: result.destinationCityCoords,
                        trackingId: trackingId
                    }
                });
            } else {
                setIsResponse('idle')
                setError(result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Something went wrong. Please try again later.");
        }
    };

    return (
        <div>

            <div className='w-full flex flex-col items-center relative'>
                {/* Background Image */}
                <div className='w-full max-md:h-[30vh] border-t-4 border-r-2 border-l-2 border-[#009688] overflow-hidden'>
                    <img src={bg_home} alt="" className='w-full h-full object-cover' />
                </div>

                {/* Text Box */}
                <div className='bg-[#f7f7f756] w-[90%] min-[769px]:w-[85%] min-[1217px]:w-[54%] absolute top-8 p-4 rounded-3xl hover:shadow-xl transition-all ease-in-out duration-300 transform hover:scale-105 text-center'>
                    <span
                        ref={typedRef}
                        className='font-semibold mt-2 text-xl sm:text-3xl text-[#009688] md:text-4xl lg:text-[44px] hover:text-[#FF7043] transition-all duration-300 transform hover:translate-y-2'
                    ></span>
                    {/* <h1 className='font-semibold mt-2 text-xl sm:text-3xl md:text-4xl lg:text-[44px] hover:text-[#FF7043] transition-all duration-300 transform hover:translate-y-2'>
            From Click to Confirmation, SwiftLogix Delivers.
          </h1> */}
                </div>


                {/* Track Shipment */}
                <div className="min-[974px]:absolute bottom-[10%] w-[70%] flex items-center justify-center md:mb-8 my-8">
                    <div className="w-full sm:w-[80%] min-[974px]:w-[60%] flex flex-col items-center">
                        <div className="w-full flex flex-col sm:flex-row sm:items-stretch items-center max-sm:gap-1">
                            <input
                                type="text"
                                required
                                onChange={handleInput}
                                value={trackingId}
                                 placeholder={placeholder}
                                 disabled={isResponse==='processing'}
                                className="placeholder:text-[#009688]  focus:border-[#FF7043] w-full p-4 border-2 border-[#009688] bg-[#F7F7F7] focus:outline-none rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none focus:ring-[#009688] focus:border-[#009688]"
                            />
                            <input
                                type="submit"
                                value={isResponse==='processing'?'Processing...':isResponse==='success'?'Tracked':'Track Now'}
                                onClick={hanldeSubmit}
                                className="bg-[#009688] hover:bg-[#FF7043] max-sm:w-40 text-white font-semibold p-4 cursor-pointer rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none transition-all duration-300 hover:text-[18px]"
                            />
                        </div>
                        {error && <p className="text-red-500 font-semibold text-md mt-2">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;

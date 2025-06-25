import { useState, useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const OfflineOnline = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    // Handle online/offline detection
    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            toast.success("Back online");
        };
        const handleOffline = () => {
            setIsOffline(true);
            toast.error("You are offline");
        };
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <>
            {isOffline && (
                <div className="fixed bottom-0 bg-red-600 text-white  w-full  text-center">
                    ⚠️ No Internet Connection
                </div>
            )}

            <ToastContainer />

        </>
    )

}

export default OfflineOnline;
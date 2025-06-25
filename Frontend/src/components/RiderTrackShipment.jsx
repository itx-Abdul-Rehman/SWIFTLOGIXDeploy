import React, { useState, useEffect } from 'react';
import Map from './Map';
// import ReactMapGL, { Marker } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';



function RiderTrackShipment({ currentCity, setCurrentCity, originCityCoords, destinationCityCoords, inTransit, transitShipments}) {


    const updateAddress = (place) => {
        setCurrentCity(place);
    };


    // // Simulating real-time location update every 3 seconds
    // useEffect(() => {
    //     fetchPackageData(); // Fetch initial data

    //     const interval = setInterval(() => {
    //         // Simulate updating the location (for example purposes)
    //         setPackageData(prevData => ({
    //             ...prevData,
    //             currentLocation: {
    //                 lat: prevData.currentLocation.lat + 0.001, // Update latitude
    //                 lng: prevData.currentLocation.lng + 0.001, // Update longitude
    //             }
    //         }));
    //     }, 3000); // Update every 3 seconds

    //     return () => clearInterval(interval);
    // }, []);

    // if (!packageData) {
    //     return <div className="text-center">Loading...</div>;
    // }

    return (
        <div className=" bg-white flex flex-col">
            <div className='flex justify-center items-center gap-4 '>
                {/* Shipment Track detials */}
                {/* <div className="flex mb-6 text-gray-700 w-[22vw] ">
                    <div className="p-5 bg-white rounded-lg shadow-lg ">
                        <div className=" rounded-full py-1 px-16 mb-4 border shadow-sm flex justify-center items-center">
                            <h2 className="text-xl font-semibold mb-2">Shipment Details</h2>
                        </div>
                        <div className="flex gap-8 ">
                            <div className="flex-1">
                                <div className="flex flex-col gap-3">
                                    <p><strong>Tracking ID:</strong> {packageData.id}</p>
                                    <p><strong>From:</strong> {packageData.from}</p>
                                    <p><strong>To:</strong> {packageData.to}</p>
                                    <p><strong>Status:</strong> {packageData.status}</p>
                                    <p><strong>Estimated Delivery:</strong> {packageData.deliveryTime}</p>
                                    <p><strong>Time Delay:</strong> {packageData.timeDelay}</p>
                                    <p><strong>Temperature:</strong> {packageData.temperature}</p>
                                    <p><strong>Current Location:</strong> {currentCity}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Real time Map */}
                
                <Map
                    updateAddress={updateAddress}
                    originCityCoords={originCityCoords}
                    destinationCityCoords={destinationCityCoords}
                    inTransit={inTransit}
                    transitShipments={transitShipments}
                />
            </div>
        </div>


    );
}

export default RiderTrackShipment;

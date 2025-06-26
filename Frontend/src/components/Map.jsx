import React, { useState, useEffect } from "react";
import markericon from './icons/marker.svg'
import tick from './icons/tick.svg'
import start from './icons/start.png'
import end from './icons/end.png'
import mapboxgl from "mapbox-gl";
import { io } from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_API_URL}`, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ["websocket"],
    autoConnect: false,
});



const Map = ({ updateAddress, originCityCoords, destinationCityCoords, inTransit, transitShipments }) => {
    const [coordinates, setCoordinates] = useState([0, 0]);
    const [placeName, setPlaceName] = useState("Your Location");
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [originMarker, setoriginMarker] = useState(null);
    const [destinationMarker, setdestinationMarker] = useState(null)
    const [originPlace, setoriginPlace] = useState(null)
    const [destPlace, setdestPlace] = useState(null);
    const [refresh, setrefresh] = useState(false);
    const MATCH_THRESHOLD = 0.0005;
    const [deliveryCompleted, setDeliveryCompleted] = useState(false);



    const waitForSecond = () => {
        setTimeout(() => {
            setrefresh(!refresh);
        }, 2000);
    }

    useEffect(() => {
        waitForSecond()
    }, [])

    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);


    useEffect(() => {
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css";
        document.head.appendChild(cssLink);

        mapboxgl.accessToken = "pk.eyJ1IjoiaXRzcmVobWFuIiwiYSI6ImNtMjkwd3ZzeDAwZ3Myam42bXE4bmE0b3cifQ.M83dkK35hWBso_XVSYfvoQ";
        const newMap = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: coordinates,
            zoom: 7,
        });

        const markerElement = document.createElement("div");
        markerElement.innerHTML = `<img src=${markericon} style="width: 35px; height: 35px; border-radius: 50%;">`;

        const newMarker = new mapboxgl.Marker({ element: markerElement })
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${placeName}</h3>`))
            .addTo(newMap);

        setMap(newMap);
        setMarker(newMarker);

        // Add origin and destination markers once
        if (inTransit && originCityCoords && destinationCityCoords) {
            const originMarkerElement = document.createElement("div");
            originMarkerElement.innerHTML = `<img src=${start} style="width: 35px; height: 35px; border-radius: 50%;">`;
            const originMarker = new mapboxgl.Marker({ element: originMarkerElement })
                .setLngLat(originCityCoords)
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${originPlace}</h3>`))
                .addTo(newMap);

            const destMarkerElement = document.createElement("div");
            destMarkerElement.innerHTML = `<img src=${end} style="width: 35px; height: 35px; border-radius: 50%;">`;
            const destinationMarker = new mapboxgl.Marker({ element: destMarkerElement })
                .setLngLat(destinationCityCoords)
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${destPlace}</h3>`))
                .addTo(newMap);

            setoriginMarker(originMarker);
            setdestinationMarker(destinationMarker);
        }

        newMap.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
                showUserHeading: true,
            })
        );

        // Draw route once map is ready
        newMap.on("load", async () => {
            if (inTransit && originCityCoords && destinationCityCoords) {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCityCoords.lng},${originCityCoords.lat};${destinationCityCoords.lng},${destinationCityCoords.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.routes.length > 0) {
                        const route = data.routes[0].geometry;

                        newMap.addSource("route", {
                            type: "geojson",
                            data: {
                                type: "Feature",
                                geometry: route,
                            },
                        });

                        newMap.addLayer({
                            id: "route-line",
                            type: "line",
                            source: "route",
                            layout: { "line-join": "round", "line-cap": "round" },
                            paint: { "line-color": "#009688", "line-width": 4 },
                        });
                    } else {
                        console.error("No routes found");
                    }
                } catch (error) {
                    console.error("Error fetching route:", error);
                }
            }
        });

        return () => {
            document.head.removeChild(cssLink);
        };
    }, []);



    useEffect(() => {
        if (map && marker) {
            if (inTransit) {
                marker.setLngLat(coordinates);
                marker.getPopup().setHTML(`<h3>${placeName}</h3>`);
                map.flyTo({ center: coordinates, zoom: 7 });
            } else {
                marker.setLngLat(coordinates);
                marker.getPopup().setHTML(`<h3>${placeName}</h3>`);
                map.flyTo({ center: coordinates, zoom: 15 });
            }

            // Check if user reached the destination
            if (destinationCityCoords) {
                const [destLng, destLat] = [destinationCityCoords.lng, destinationCityCoords.lat];
                const [userLng, userLat] = coordinates;
                if (Math.abs(userLng - destLng) < MATCH_THRESHOLD && Math.abs(userLat - destLat) < MATCH_THRESHOLD) {
                    setDeliveryCompleted(true);
                }
            }


        }
    }, [coordinates, placeName, map, marker, destinationCityCoords]);


    //
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates([position.coords.longitude, position.coords.latitude]);
            },
            (error) => {
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        navigator.geolocation.watchPosition(
            async (position) => {
                const userCoordinates = [position.coords.longitude, position.coords.latitude];
                // console.log(userCoordinates)
                // console.log("Accuracy (in meters):", position.coords.accuracy);
                setCoordinates(userCoordinates);
                if (socket.connected) {
                    socket.emit("send-location", { coordinates: userCoordinates, transitShipments });
                }

                // Reverse Geocoding for Address
                mapboxgl.accessToken = "pk.eyJ1IjoiaXRzcmVobWFuIiwiYSI6ImNtMjkwd3ZzeDAwZ3Myam42bXE4bmE0b3cifQ.M83dkK35hWBso_XVSYfvoQ";
                const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userCoordinates[0]},${userCoordinates[1]}.json?access_token=${mapboxgl.accessToken}`;
                try {
                    const response = await fetch(geocodeUrl);
                    const res = await response.json();
                    if (res.features?.length > 0) {
                        const { place_name, context } = res.features[0];
                        let city = context?.find(item => item?.id.includes("place"))?.text || place_name.split(",")[0];
                        setPlaceName(city);
                        updateAddress(city);
                    }
                } catch (error) {
                    console.error("Error fetching user location:", error);
                }

                //send coordinates on socket
                //  if (socket.connected) {
                //     transitShipments.forEach((shipment) => {
                //         socket.emit("send-location", {trackingId:shipment.trackingid,coordinates:userCoordinates});
                //     });
                // }

            },
            (error) => {
                console.error("Error retrieving live location:", error);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }  // Adjusted settings
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }


    // useEffect(()=>{
    //    if(deliveryCompleted){

    //    }
    // },[deliveryCompleted])

    const shipmentComplete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/shipment-completed`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transitShipments })
                }
            )

            const result = await response.json();
            if (result.success) {
                setDeliveryCompleted(false)
                window.location.reload()
            }

        } catch (error) {

        }
    }


    return (
        <div className="w-full h-screen flex flex-col items-center pt-5">
            <div
                id="map"
                className="w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] min-[1226px]:w-[50vw] h-screen sm:h-[400px] md:h-[450px] lg:h-[500px] m-[20px]  border-none shadow-xl rounded-lg overflow-hidden"
            ></div>

            {deliveryCompleted && (
                <>
                    <div className='w-full flex justify-center items-center fixed inset-0 px-4 sm:px-6 lg:px-8'>
                        <div className='w-full max-w-md sm:max-w-lg p-5 md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col items-center  relative transition-all duration-300'>
                            <img
                                src={tick}
                                alt="Success"
                                className='w-16 sm:w-20 shadow-2xl rounded-full absolute -top-12'
                            />

                            <p className='text-gray-700 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold'>
                                Congratulations, you have successfully reached your destination.
                            </p>

                            <div
                                onClick={shipmentComplete}
                                className="mt-4 px-6 py-3 bg-[#009688] text-white text-sm sm:text-base font-bold rounded cursor-pointer hover:bg-[#FF7043] transition duration-300"
                            >
                                Delivery Completed
                            </div>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};

export default Map;

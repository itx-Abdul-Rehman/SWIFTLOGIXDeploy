import React, { useState, useEffect, useRef } from "react";
import markericon from './icons/marker.svg';
import start from './icons/start.png';
import end from './icons/end.png';
import mapboxgl from "mapbox-gl";
import { io } from 'socket.io-client';

const socket = io(`https://swiftlogix.cc`, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ["websocket"],
    autoConnect: false,
});

const CustomerMap = ({ originCityCoords, destinationCityCoords, trackingId, setLastUpdateAgo, setEta }) => {
    const [coordinates, setCoordinates] = useState([0, 0]);
    const [placeName, setPlaceName] = useState("Your Location");
    const mapRef = useRef(null);
    const riderMarkerRef = useRef(null);
    const originMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);

    const parseCustomDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');

        return new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            seconds
        );
    };


    const calculateTimeDifference = (pastDate) => {
        const now = new Date();
        const past = new Date(pastDate);

        const diffMs = now - past;

        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let result;
        if (minutes < 1) result = 'Just now';
        else if (minutes < 60) result = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        else if (hours < 24) result = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        else result = `${days} day${days !== 1 ? 's' : ''} ago`;

        setLastUpdateAgo(result);
    };

    // Fetch initial coordinates
    useEffect(() => {
        const fetchCoordinates = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get-route-coordinates`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId })
            });

            const result = await response.json();
            if (result.success) {
                setCoordinates(result.route.coordinates);
                const parsedDate = result.route.datetime;
                calculateTimeDifference(parsedDate);
            }
        };
        fetchCoordinates();
    }, [trackingId]);

    // Setup socket and listen for live updates
    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    socket.emit("register", trackingId);

    socket.on("receive-location", (data) => {
        console.log(data.coords)
        setCoordinates(data.coords)
    })



    // Initialize the map once
    useEffect(() => {
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css";
        document.head.appendChild(cssLink);

        mapboxgl.accessToken = "pk.eyJ1IjoiaXRzcmVobWFuIiwiYSI6ImNtMjkwd3ZzeDAwZ3Myam42bXE4bmE0b3cifQ.M83dkK35hWBso_XVSYfvoQ";

        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: coordinates,
            zoom: 12,
        });

        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true,
        }));

        mapRef.current = map;

        // Rider marker
        const riderEl = document.createElement("div");
        riderEl.innerHTML = `<img src=${markericon} style="width: 35px; height: 35px; border-radius: 50%;">`;
        riderMarkerRef.current = new mapboxgl.Marker({ element: riderEl })
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${placeName}</h3>`))
            .addTo(map);

        // Origin marker
        const originEl = document.createElement("div");
        originEl.innerHTML = `<img src=${start} style="width: 35px; height: 35px; border-radius: 50%;">`;
        originMarkerRef.current = new mapboxgl.Marker({ element: originEl })
            .setLngLat(originCityCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Origin</h3>`))
            .addTo(map);

        // Destination marker
        const destEl = document.createElement("div");
        destEl.innerHTML = `<img src=${end} style="width: 35px; height: 35px; border-radius: 50%;">`;
        destinationMarkerRef.current = new mapboxgl.Marker({ element: destEl })
            .setLngLat(destinationCityCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Destination</h3>`))
            .addTo(map);

        // Draw route line
        const getRoute = async () => {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCityCoords.lng},${originCityCoords.lat};${destinationCityCoords.lng},${destinationCityCoords.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.routes.length > 0) {
                const route = data.routes[0].geometry;

                map.addSource("route", {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        geometry: route,
                    },
                });

                map.addLayer({
                    id: "route-line",
                    type: "line",
                    source: "route",
                    layout: { "line-join": "round", "line-cap": "round" },
                    paint: { "line-color": "#009688", "line-width": 4 },
                });
            }
        };

        map.on("load", getRoute);

        return () => {
            document.head.removeChild(cssLink);
            map.remove();
        };
    }, []);

    // Update rider marker position in real-time
    useEffect(() => {
        if (riderMarkerRef.current && mapRef.current) {
            riderMarkerRef.current.setLngLat(coordinates);
            riderMarkerRef.current.getPopup().setHTML(`<h3>${placeName}</h3>`);
            mapRef.current.flyTo({ center: coordinates, zoom: 12 });
        }
    }, [coordinates]);


    useEffect(() => {
        if (!coordinates || !destinationCityCoords) return;

        const fetchETA = async () => {
            mapboxgl.accessToken = "pk.eyJ1IjoiaXRzcmVobWFuIiwiYSI6ImNtMjkwd3ZzeDAwZ3Myam42bXE4bmE0b3cifQ.M83dkK35hWBso_XVSYfvoQ";
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates[0]},${coordinates[1]};${destinationCityCoords.lng},${destinationCityCoords.lat}?geometries=geojson&overview=false&access_token=${mapboxgl.accessToken}`;

            try {
                const res = await fetch(url);
                const data = await res.json();
                const duration = data.routes[0].duration;

                setEta(Math.round(duration / 60));
            } catch (err) {
                console.error("Failed to fetch ETA:", err);
            }
        };

        fetchETA();
    }, [coordinates, destinationCityCoords])


    return (
        <div className="flex flex-col items-center p-4 w-full">
            <div
                id="map"
                className="w-full max-w-[800px] h-[300px] sm:h-[400px] md:h-[500px] border-none shadow-xl rounded-lg"
            ></div>
        </div>

    );
};

export default CustomerMap;

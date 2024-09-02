"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const AddLocation = ({ handleLocationChange }) => {
  const [position, setPosition] = useState(null); // Default position set to null initially

  const svgIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="#000000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
</svg>

`;

  // Define custom icon using SVG
  const customIcon = new L.divIcon({
    html: svgIcon,
    iconSize: [32, 32], // icon size
    iconAnchor: [16, 16], // icon anchor
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for client-side environment
      const getUserLocation = async () => {
        try {
          const location = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (location) => resolve(location),
              (error) => reject(error)
            );
          });
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
          handleLocationChange(latitude, longitude); // Call handleLocationChange with obtained coordinates
        } catch (error) {
          console.error("Error getting user location:", error);
          // Handle error gracefully, set default location if needed
        }
      };
      getUserLocation();
    }
  }, []); // Empty dependency array to ensure this effect runs only once when component mounts

  const handleMarkerDrag = (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    setPosition([lat, lng]);
    handleLocationChange(lat, lng);
  };

  return (
    <div>
      {position ? (
        <MapContainer center={position} zoom={13} style={{ height: "400px" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={position}
            draggable={true}
            eventHandlers={{ dragend: handleMarkerDrag }}
            icon={customIcon}
          >
            <Popup>Selected location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
      {position && (
        <div>
          <h3>Latitude: {position[0]}</h3>
          <h3>Longitude: {position[1]}</h3>
        </div>
      )}
    </div>
  );
};

export default AddLocation;

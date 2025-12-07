import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map center when props change
const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

const MapTracking = ({ userLocation, mechanicLocation }) => {
    // Default to Delhi if no location provided
    const defaultCenter = [28.7041, 77.1025];

    // Use mechanic location as center if available, else user location, else default
    const center = mechanicLocation
        ? [mechanicLocation.latitude, mechanicLocation.longitude]
        : userLocation
            ? [userLocation.latitude, userLocation.longitude]
            : defaultCenter;

    return (
        <div className="h-64 w-full rounded-lg overflow-hidden shadow-inner border border-gray-300">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                    <Marker position={[userLocation.latitude, userLocation.longitude]}>
                        <Popup>
                            You are here
                        </Popup>
                    </Marker>
                )}

                {mechanicLocation && (
                    <>
                        <Marker position={[mechanicLocation.latitude, mechanicLocation.longitude]}>
                            <Popup>
                                Mechanic is here
                            </Popup>
                        </Marker>
                        <RecenterAutomatically lat={mechanicLocation.latitude} lng={mechanicLocation.longitude} />
                    </>
                )}
            </MapContainer>
        </div>
    );
};

export default MapTracking;

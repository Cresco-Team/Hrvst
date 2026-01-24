// Reusable map Component

import { MapContainer, TileLayer } from 'react-leaflet';
import '../../../utils/leafletSetup';

export default function BaseMap({ center, zoom, children, className = '' }) {
    return (
        /* Initialize the view of the Map Setup  */
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            className={className}
            key={`${center[0]}-${center[1]}-${zoom}`}
        >   {/* Fetches & Displays the actual Map Imagery */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* FarmerMarker */}
            {children}
        </MapContainer>
    );
}
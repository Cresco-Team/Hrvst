import BaseModal from "@/Components/Modals/Base/BaseModal";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import '@/utils/leafletSetup';

function MapResizeFix({ isOpen }) {
    const map = useMap();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                map.invalidateSize();
            }, 100); 
        }
    }, [isOpen, map]);

    return null;
}

function MapController({ center, zoom }) {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);
    
    return null;
}

function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapModal({ 
    isOpen, 
    onClose, 
    center, 
    zoom,
    markerPosition,
    municipalityName,
    barangayName,
    onLocationSelect,
    onConfirm 
}) {
    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            maxWidth="2xl"
        >
            <div className="bg-white rounded-lg p-6">
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">Locate your Farm!</h3>
                    <p className="text-sm text-gray-600">
                        {municipalityName || 'Municipality'}{barangayName ? `, ${barangayName}` : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Click on the map to set your exact farm location</p>
                </div>
                
                <div className="w-full h-96 block rounded-md overflow-hidden border">
                    <MapContainer 
                        center={center} 
                        zoom={zoom} 
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <MapResizeFix isOpen={isOpen} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapController center={center} zoom={zoom} />
                        <MapClickHandler onLocationSelect={onLocationSelect} />
                        {markerPosition && (
                            <Marker position={markerPosition} />
                        )}
                    </MapContainer>
                </div>
                
                {markerPosition && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Selected: {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
                    </p>
                )}
                
                <div className="mt-4 flex gap-2">
                    <button 
                        onClick={onClose} 
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={!markerPosition}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}

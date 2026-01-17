import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useEffect } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';

function MapController({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);
    return null;
}

function MapClickHandler({ onSelect }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
            console.log(e.latlng);
        },
    });
    return null;
}

export default function MapDialog({center, zoom, onSelect, markerPosition }) {

    return (
        <AspectRatio ratio={16/9} className='bg-muted rounded-lg'>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='Cresco Team - Hrvst | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={center} zoom={zoom}/>
                <MapClickHandler onSelect={onSelect}/>
                {markerPosition && (
                    <Marker position={markerPosition} />
                )}
            </MapContainer>
        </AspectRatio>
    )
}
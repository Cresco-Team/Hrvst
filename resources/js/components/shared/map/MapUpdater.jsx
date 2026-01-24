// --------------------------------------------------------
// For Changing the View of the Map after it has been Rendered by react-leaflet

    // Relies on the Map Instance being Available.
// --------------------------------------------------------

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapUpdater({ center, zoom }) {
    /* Allows to get Direct Access to the Map object */
    const map = useMap();
    
    /* Runs the Code whenever any dependencies (center, zoom, or map) Change */
    useEffect(() => {
        if (center) {
            map.setView(center, zoom); // Tells the map instance to immediately pan & zoom to the new coordinates specified by the props
        }
    }, [center, zoom, map]);
    
    return null;
}
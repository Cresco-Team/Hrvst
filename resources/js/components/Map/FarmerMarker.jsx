import { Marker, Popup } from 'react-leaflet';

export default function FarmerMarker({ farmer, onViewDetails, registerMarker }) {
    return (
        <Marker
            ref={registerMarker}
            position={[parseFloat(farmer.latitude), parseFloat(farmer.longitude)]}
            eventHandlers={{
                click: () => onViewDetails(farmer.id)
            }}
        >
            <Popup>
                <div className="text-center min-w-[150px]">
                    <strong className="text-base">{farmer.user.name}</strong>
                    <div className="flex gap-1 mt-2 justify-center flex-wrap">
                        {farmer.crops.slice(0, 3).map(crop => (
                            <div 
                                key={crop.id} 
                                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                title={crop.name}
                            >
                                {crop.name.charAt(0)}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onViewDetails(farmer.id);
                        }}
                        className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                        View Details →
                    </button>
                </div>
            </Popup>
        </Marker>
    );
}
import { Marker, Popup } from 'react-leaflet';

export default function FarmerMarker({ farmer, onViewDetails, registerMarker }) {
    return (
        /* The Marker itself */
        <Marker
            ref={registerMarker}
            position={[parseFloat(farmer.latitude), parseFloat(farmer.longitude)]}
            eventHandlers={{
                click: () => onViewDetails(farmer.id)
            }}
        >
            {/* Popup Short Information of the Marker */}
            <Popup autoClose={false} closeOnClick={false}>
                <div className="text-center min-w-[150px]">

                    {/* Farmer Name */}
                    <strong className="text-base">{farmer.user.name}</strong>

                    {/* Farmer Crops Planted */}
                    <div className="flex gap-1 mt-2 justify-center flex-wrap">
                        {farmer.crops.map(crop => (
                            <div 
                                key={crop.id} 
                                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                title={crop.name}
                            >
                                {crop.image_path ? (
                                <img
                                    src={`/storage/${crop.image_path}`}
                                    alt={crop.name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                <svg className="w-10 h-10 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                </svg>
                            )}
                            </div>
                        ))}
                    </div>

                    {/* Button */}
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
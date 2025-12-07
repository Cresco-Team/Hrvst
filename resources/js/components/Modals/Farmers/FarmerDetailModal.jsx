import BaseModal from './Base/BaseModal';

export default function FarmerDetailModal({ isOpen, onClose, farmer }) {
    if (!farmer) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            maxWidth="lg"
        >
            <div className="text-center">
                {/* Header */}
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{farmer.user.name}</h2>
                <p className="text-gray-600 mb-6">
                    {farmer.barangay.name}, {farmer.municipality.name}
                </p>

                {/* Map Placeholder */}
                <div className="w-full h-64 bg-green-50 rounded-lg mb-6 flex items-center justify-center">
                    <svg className="w-20 h-20 text-green-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                </div>

                {/* Crops Produced */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Crops Produced</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                    {farmer.crops.map(crop => (
                        <div 
                            key={crop.id}
                            className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center"
                        >
                            {crop.image ? (
                                <img
                                    src={`/storage/${crop.image}`}
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
            </div>
        </BaseModal>
    );
}
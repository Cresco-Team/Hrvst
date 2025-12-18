import Button from '@/Components/Buttons/Button';

export default function CropCard({ 
    crop, 
    isAdmin, 
    onEdit, 
    onDelete,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 relative">
            {/* Delete Button */}
            {isAdmin && (
                <Button
                    variant="black"
                    size="sm"
                    onClick={() => onDelete(crop)}
                    className="absolute top-3 right-3 z-10 rounded-full"
                >
                    DELETE
            </Button>
            )}

            {/* Image */}
            <div className="h-32 w-full bg-green-50">
                {crop.image_path ? (
                    <img
                        src={`/storage/${crop.image_path}`}
                        alt={crop.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-base text-gray-800 mb-1">
                    {crop.name}
                </h3>
                <p className="text-lg font-bold text-gray-900">
                    ₱{parseFloat(crop.low_price).toFixed(2)} - ₱{parseFloat(crop.high_price).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Harvest: {crop.harvest_weeks} weeks
                </p>

                {isAdmin && (
                    <Button
                        variant="outlineDark"
                        size="md"
                        fullWidth
                        onClick={() => onEdit(crop)}
                        className="mt-3 rounded-full"
                    >
                        Edit
                    </Button>
                )}
            </div>
        </div>
    );
}
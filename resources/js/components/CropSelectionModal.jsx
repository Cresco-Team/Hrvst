export default function CropSelectionModal({ 
    isOpen, 
    onClose, 
    crops, 
    selectedCrops, 
    onCropToggle, 
    onSave 
}) {
    if (!isOpen) return null;

    const cropsByCategory = crops.reduce((acc, crop) => {
        const category = crop.category?.name || "Uncategorized";

        if (!acc[category]) {
            acc[category] = [];
        }

        acc[category].push(crop);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">

                <h3 className="text-lg font-semibold mb-4">
                    Select Crops (Maximum 5)
                </h3>

                {/* Grouped by Category */}
                {Object.entries(cropsByCategory).map(([categoryName, categoryCrops]) => (
                    <div key={categoryName} className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-2">
                            {categoryName}
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categoryCrops.map((crop) => (
                                <div
                                    key={crop.id}
                                    onClick={() => onCropToggle(crop.id)}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        selectedCrops.includes(crop.id)
                                            ? "border-green-600 bg-green-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                >
                                    {crop.image && (
                                        <img
                                            src={`/storage/${crop.image}`}
                                            alt={crop.name}
                                            className="w-full h-24 object-cover rounded-md mb-2"
                                        />
                                    )}
                                    <p className="font-medium text-sm">{crop.name}</p>
                                    <p className="text-xs text-gray-600">
                                        {crop.category?.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={selectedCrops.length === 0 || selectedCrops.length > 5}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        Save ({selectedCrops.length} selected)
                    </button>
                </div>
            </div>
        </div>
    );
}
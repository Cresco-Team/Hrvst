import InputError from '@/components/InputError';

export default function GeolocationBtn({ 
    hasLocation, 
    onOpenMap, 
    errors 
}) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Geolocation</h3>
            <button
                type="button"
                onClick={onOpenMap}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {hasLocation ? 'Update Location' : 'Locate your Address'}
            </button>
            {hasLocation && (
                <p className="text-xs text-green-600 text-center font-medium">
                    ✓ Location set successfully
                </p>
            )}
            <InputError message={errors.latitude || errors.longitude} className="mt-2" />
        </div>
    );
}
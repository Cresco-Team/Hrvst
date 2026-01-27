
import BaseMap from "@/components/shared/map/BaseMap"
import FarmerMarker from "@/components/shared/map/FarmerMarker"
import MapResizer from "@/components/shared/map/map-resizer"
import MapUpdater from "@/components/shared/map/MapUpdater"
import AppLayout from "@/layouts/app-layout"

export default function Geolocation({ farmers }) {

    const getMapCenter = () => {
        if (farmers.length === 0) {
            return { center: [16.4, 120.6], zoom: 9 }
        }

        const avgLatitude = farmers.reduce(
            (sum, f) => sum + parseFloat(f.latitude), 0
        ) / farmers.length
        const avgLongitude = farmers.reduce(
            (sum, f) => sum + parseFloat(f.longitude), 0
        ) / farmers.length

        return {
            center: [avgLatitude, avgLongitude],
            zoom: 11
        }
    }
    const {
        center,
        zoom,
    } = getMapCenter()

    return (
        <AppLayout title={'Farmers Geolocation'}>
            <div className="container h-full rounded-2xl overflow-hidden">
                <BaseMap
                    center={center}
                    zoom={zoom}
                >
                    <MapResizer />
                    <MapUpdater
                        center={center}
                        zoom={zoom}
                    />
                    {farmers.map((farmer) => (
                        <FarmerMarker
                            key={farmer.id}
                            farmer={farmer}
                        />
                    ))}
                </BaseMap>
            </div>
            
        </AppLayout>
    )
}
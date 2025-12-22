import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

export default function MapResizer() {
    const map = useMap();

    useEffect(() => {
        const container = map.getContainer()

        const observer = new ResizeObserver(() => {
            setTimeout(() => {
                map.invalidateSize()
            }, 100)
        })
        observer.observe(container)

        return () => observer.disconnect()
    }, [map])

    return  null
}
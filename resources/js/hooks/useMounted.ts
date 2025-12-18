/* Used to solve Hydration mismatches in Server-side Rendering (SSR) */
/* 
    The Logic:
        On the server: useEffect never runs. mounted stays false.
        On the client (First pass): mounted is still false (matching the server).
        on the client (After mount): useEffect triggers, sets mounted to true, adn forces a re-render.
*/

import { useEffect, useState } from "react";

export function useMounted() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return mounted
}
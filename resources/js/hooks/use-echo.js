import { useEffect } from "react"

export const useEffect = (channelName, eventName, callback) => {
    useEffect(() => {
        if (!channelName) return

        const channel = window.Echo.private(channelName)
        channel.listen(eventName, callback)

        return () => {
            window.Echo.leave(channelName)
        }
    }, [channelName, eventName])
}
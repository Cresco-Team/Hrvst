import { usePage } from "@inertiajs/react"
import { useEffect } from "react"
import { toast } from "sonner"


const FlashToaster = () => {
    const { flash } = usePage().props

    useEffect(() => {
        if (flash.info) {
            toast.info(flash.info)
        } if (flash.success) {
            toast.success(flash.success)
        } if (flash.error) {
            toast.error(flash.error)
        }
    }, [flash])

    return null
}
export default FlashToaster
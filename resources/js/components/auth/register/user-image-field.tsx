import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Field } from "@/components/ui/field"
import { Plus } from "lucide-react"
import { useRef, useState } from "react"


const UserImageField = ({ data, setData }) => {
    const [imagePreview, setImagePreview] = useState(data.image || null)
    const fileRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setData('farm_image_path', file)

        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result)
        reader.readAsDataURL(file)
    }

    return (
        <Field className="flex-1">
            <AspectRatio ratio={16 / 9} className='rounded-2xl'>
                <div
                    className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden"
                    onClick={() => fileRef.current.click()}
                >
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {imagePreview ? (
                        <div className='group relative aspect-video w-full overflow-hidden cursor-pointer rounded-2xl'>
                            <img
                                src={imagePreview}
                                alt="Uploaded Preview"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Hover Overlay */}
                            <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                                <Plus strokeWidth={2} size={80} className="text-white" />
                                <p className="mt-2 text-center text-xs text-background">
                                    Click to change
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Plus strokeWidth={2} size={60} />
                                <span className="text-sm font-medium">Upload Image</span>
                            </div>
                        </div>
                    )}
                </div>
            </AspectRatio>
        </Field>
    )
}
export default UserImageField
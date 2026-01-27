import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePage } from "@inertiajs/react"
import { ArrowLeftIcon, ImageIcon, SendIcon, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import MessageBubble from "./message-bubble"
import { useEcho } from "@/hooks/use-echo"

const ChatWindow = ({ conversation, messages: initialMessages, onBack }) => {
    const { auth } = usePage().props
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef(null)
    const fileInputRef = useRef(null)

        useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

        useEcho(
        `conversation.${conversation.id}`,
        '.message.sent',
        (event) => {
            setMessages(prev => [...prev, {
                id: event.id,
                sender_id: event.sender_id,
                sender_name: event.sender_name,
                message: event.message,
                image_url: event.image_url,
                is_mine: false,
                is_read: false,
                sent_at: new Date(event.created_at).toLocaleString(),
            }])
        }
    )

        useEcho(
        `conversation.${conversation.id}`,
        '.message.read',
        (event) => {
            if (event.user_id !== auth.user.id) {
                                setMessages(prev => prev.map(msg => 
                    msg.is_mine ? { ...msg, is_read: true } : msg
                ))
            }
        }
    )

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

                if (!file.type.startsWith('image/')) {
            alert('Please select an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB')
            return
        }

        setSelectedImage(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleRemoveImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        
        if ((!newMessage.trim() && !selectedImage) || isSending) return

                const tempId = Date.now()
        const tempMessage = {
            id: tempId,
            sender_id: auth.user.id,
            sender_name: auth.user.name,
            message: newMessage.trim(),
            image_url: imagePreview,
            is_mine: true,
            is_read: false,
            sent_at: 'Sending...',
        }

        setMessages(prev => [...prev, tempMessage])
        
        const messageContent = newMessage.trim()
        const imageToSend = selectedImage
        
        setNewMessage('')
        setSelectedImage(null)
        setImagePreview(null)
        setIsSending(true)

        try {
            const formData = new FormData()
            formData.append('conversation_id', conversation.id)
            if (messageContent) {
                formData.append('message', messageContent)
            }
            if (imageToSend) {
                formData.append('image', imageToSend)
            }

            const response = await window.axios.post('/api/messages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

                        setMessages(prev => prev.map(msg => 
                msg.id === tempId ? response.data.message : msg
            ))

        } catch (error) {
            console.error('Failed to send message:', error)
            
                        setMessages(prev => prev.filter(m => m.id !== tempId))
            
                        setNewMessage(messageContent)
            if (imageToSend) {
                setSelectedImage(imageToSend)
                setImagePreview(URL.createObjectURL(imageToSend))
            }

            alert('Failed to send message. Please try again.')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="md:hidden"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Button>
                )}

                <div className="flex-1">
                    <h3 className="font-semibold">{conversation.other_user.name}</h3>
                    {conversation.planting && (
                        <p className="text-sm text-muted-foreground">
                            Re: {conversation.planting.crop_name}
                        </p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))
                )}
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                {/* Image preview */}
                {imagePreview && (
                    <div className="mb-2 relative inline-block">
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-20 w-20 object-cover rounded border"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={handleRemoveImage}
                        >
                            <XIcon className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                    />
                    
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending}
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>

                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={isSending}
                        className="flex-1"
                    />
                    
                    <Button 
                        type="submit" 
                        disabled={(!newMessage.trim() && !selectedImage) || isSending}
                        size="icon"
                    >
                        <SendIcon className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatWindow
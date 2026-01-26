import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { router, usePage } from "@inertiajs/react"
import { ArrowLeftIcon, SendIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import MessageBubble from "./message-bubble"


const ChatWindow = ({ conversation, messages: initialMessages, onBack }) => {
    const { auth } = usePage().props
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef(null)

    const getMessageRoute = () => {
        const userRoles = auth.user.roles || []

        if (userRoles.includes('farmer')) return 'farmer.messages.store'
        if (userRoles.includes('dealer')) return 'dealer.messages.store'

        throw new Error('User role not recognized')
    }
    const messageRoute = getMessageRoute()

    // Listen for real-time messages
    useEffect(() => {
        const channel = window.Echo.private(`conversation.${conversation.id}`)
            .listen('.message.sent', (event) => {
                // Only add message if it's from the other user (avoid duplicates)
                if (event.sender_id !== auth.user.id) {
                    setMessages(prev => [...prev, {
                        id: event.id,
                        sender_id: event.sender_id,
                        sender_name: event.sender_name,
                        message: event.message,
                        image_path: event.image_path,
                        is_mine: false,
                        is_read: event.read_at !== null,
                        sent_at: new Date(event.created_at).toLocaleString(),
                    }])
                }
            })

        return () => {
            window.Echo.leave(`conversation.${conversation.id}`)
        }
    }, [conversation.id, auth.user.id])

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        
        if (!newMessage.trim() || isSending) return

        const messageContent = newMessage.trim()
        setNewMessage('')
        setIsSending(true)

        try {
            await router.post(route(messageRoute), {
                conversation_id: conversation.id,
                message: messageContent,
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    // Refresh messages from server response
                    if (page.props.messages) {
                        setMessages(page.props.messages)
                    }
                },
                onError: () => {
                    setNewMessage(messageContent)
                }
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))
                )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={isSending}
                        className="flex-1"
                    />
                    <Button 
                        type="submit" 
                        disabled={!newMessage.trim() || isSending}
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
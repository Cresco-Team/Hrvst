import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { router } from "@inertiajs/react"
import { ArrowLeftIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"


const ChatWindow = ({ conversation, messages: initialMessages, onBack }) => {
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef(null)

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        
        if (!newMessage.trim() || isSending) return

        setIsSending(true)

        try {
            await router.post(route('dealer.messages.store'), {
                conversation_id: conversation.id,
                message: newMessage.trim(),
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('')
                    // Optimistically add message to UI
                    // Real-time update will come via Reverb
                },
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
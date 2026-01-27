import { cn } from "@/lib/utils"
import { CheckCheckIcon, CheckIcon } from "lucide-react"

const MessageBubble = ({ message }) => {
    return (
        <div className={cn(
            'flex gap-2 mb-4',
            message.is_mine ? 'justify-end' : 'justify-start'
        )}>
            <div className={cn(
                'max-w-[70%] rounded-lg px-4 py-2',
                message.is_mine 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
            )}>
                {!message.is_mine && (
                    <p className="text-xs font-semibold mb-1">
                        {message.sender_name}
                    </p>
                )}

                {/* Image */}
                {message.image_url && (
                    <img 
                        src={message.image_url}
                        alt="Attachment"
                        className="rounded max-w-full mb-2 cursor-pointer hover:opacity-90"
                        onClick={() => window.open(message.image_url, '_blank')}
                    />
                )}
                
                {/* Text */}
                {message.message && (
                    <p className="text-sm whitespace-pre-wrap break-words">
                        {message.message}
                    </p>
                )}

                {/* Timestamp & read status */}
                <div className={cn(
                    'flex items-center gap-1 mt-1',
                    message.is_mine ? 'justify-end' : 'justify-start'
                )}>
                    <p className="text-xs opacity-70">
                        {message.sent_at}
                    </p>
                    
                    {message.is_mine && (
                        message.is_read ? (
                            <CheckCheckIcon className="h-3 w-3" />
                        ) : (
                            <CheckIcon className="h-3 w-3" />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble
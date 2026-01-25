import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"


const ConversationListItem = ({ conversation, isActive, onClick }) => {
    
    return (
        <div
            onClick={onClick}
            className={cn(
                'flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 border-b',
                isActive && 'bg-muted'
            )}
        >
            <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.planting?.crop_image} />
                <AvatarFallback>
                    {conversation.other_user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                            {conversation.other_user.name}
                        </p>
                        {conversation.planting && (
                            <p className="text-xs text-muted-foreground truncate">
                                Re: {conversation.planting.crop_name}
                            </p>
                        )}
                    </div>
                    
                    {conversation.unread_count > 0 && (
                        <Badge variant="default" className="ml-2 shrink-0">
                            {conversation.unread_count}
                        </Badge>
                    )}
                </div>

                {conversation.latest_message && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.latest_message.text}
                    </p>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                    {conversation.last_message_at}
                </p>
            </div>
        </div>
    )
}
export default ConversationListItem
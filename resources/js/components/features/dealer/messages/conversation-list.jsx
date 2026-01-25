import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchIcon } from "lucide-react"
import ConversationListItem from "./conversation-list-item"
import { useState } from "react"


const ConversationList = ({ conversations, selectedConversationId, onSelectConversation }) => {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredConversations = conversations.filter(conv =>
        conv.other_user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.planting?.crop_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full border-r">
            {/* Search Header */}
            <div className="p-4 border-b">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <p className="text-sm">No conversations found</p>
                    </div>
                ) : (
                    filteredConversations.map((conversation) => (
                        <ConversationListItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={conversation.id === selectedConversationId}
                            onClick={() => onSelectConversation(conversation.id)}
                        />
                    ))
                )}
            </ScrollArea>
        </div>
    )
}
export default ConversationList
import ChatWindow from "@/components/features/dealer/messages/chat-window"
import ConversationList from "@/components/features/dealer/messages/conversation-list"
import AppLayout from "@/layouts/app-layout"
import { router } from "@inertiajs/react"
import { MessageSquareIcon } from "lucide-react"
import { useEffect, useState } from "react"


const FarmerMessages = ({ conversations, selectedConversation, messages }) => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleSelectConversation = (conversationId) => {
        router.get(route('farmer.messages.index'), {
            conversation_id: conversationId
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const handleBackToList = () => {
        router.get(route('farmer.messages.index'), {}, {
            preserveState: false,
        })
    }

    if (isMobile) {
        return (
            <AppLayout title="Messages">
                <div className="h-[calc(100vh-4rem)]">
                    {selectedConversation ? (
                        <ChatWindow
                            conversation={selectedConversation}
                            messages={messages || []}
                            onBack={handleBackToList}
                        />
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            selectedConversationId={null}
                            onSelectConversation={handleSelectConversation}
                        />
                    )}
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout title="Messages">
            <div className="h-[calc(100vh-4rem)]">
                <div className="flex h-full border rounded-lg overflow-hidden bg-card">
                    <div className="w-95 shrink-0">
                        <ConversationList
                            conversations={conversations}
                            selectedConversationId={selectedConversation?.id || null}
                            onSelectConversation={handleSelectConversation}
                        />
                    </div>

                    <div className="flex-1">
                        {selectedConversation ? (
                            <ChatWindow
                                conversation={selectedConversation}
                                messages={messages || []}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <MessageSquareIcon className="h-16 w-16 mb-4" />
                                <p className="text-lg font-semibold">Select a conversation</p>
                                <p className="text-sm">Choose a dealer to view messages</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
export default FarmerMessages
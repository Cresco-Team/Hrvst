<?php

namespace App\Services;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Repositories\ConversationRepository;
use App\Repositories\MessageRepository;

class MessagingService
{
    public function __construct(
        protected ConversationRepository $conversationRepo,
        protected MessageRepository $messageRepo
    ) {}

    /**
     * Start or get existing conversation
     */
    public function startConversation(int $dealerId, int $farmerId, ?int $plantingId = null): Conversation
    {
        return $this->conversationRepo
            ->findOrCreateConversation($dealerId, $farmerId, $plantingId);
    }

    /**
     * Send a message in a conversation
     */
    public function sendMessage(int $conversationId, int $senderId, string $messageText): Message
    {
        $message = $this->messageRepo->create([
            'conversation_id' => $conversationId,
            'sender_id' => $senderId,
            'message' => $messageText,
        ]);

        // Update conversation last message time
        $this->conversationRepo->updateLastMessageTime($conversationId);

        // Broadcast the message via Reverb
        broadcast(new MessageSent($message))->toOthers();

        return $message;
    }

    /**
     * Get all conversations for a user
     */
    public function getUserConversations(int $userId): array
    {
        $conversations = $this->conversationRepo->getUserConversations($userId);

        return $conversations->map(function ($conversation) use ($userId) {
            $otherUser = $conversation->getOtherParticipant($userId);
            $latestMsg = $conversation->latestMessage->first();

            return [
                'id' => $conversation->id,
                'other_user' => [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                ],
                'planting' => $conversation->planting ? [
                    'id' => $conversation->planting->plant_id,
                    'crop_name' => $conversation->planting->crop->name,
                    'crop_image' => $conversation->planting->crop->image_path,
                ] : null,
                'latest_message' => $latestMsg ? [
                    'text' => $latestMsg->message,
                    'sent_at' => $latestMsg->created_at->diffForHumans(),
                    'is_read' => $latestMsg->isRead(),
                ] : null,
                'unread_count' => $conversation->getUnreadCountForUser($userId),
                'last_message_at' => $conversation->last_message_at?->diffForHumans(),
            ];
        })->toArray();
    }

    /**
     * Get messages for a conversation
     */
    public function getConversationMessages(int $conversationId, int $userId): array
    {
        $conversation = $this->conversationRepo->findById($conversationId);

        if (!$conversation || !$conversation->hasParticipant($userId)) {
            abort(403, 'Unauthorized access to conversation');
        }

        // Mark messages as read
        $conversation->markAsReadForUser($userId);

        $messages = $this->conversationRepo->getConversationMessages($conversationId);

        return [
            'conversation' => [
                'id' => $conversation->id,
                'other_user' => [
                    'id' => $conversation->getOtherParticipant($userId)->id,
                    'name' => $conversation->getOtherParticipant($userId)->name,
                ],
                'planting' => $conversation->planting ? [
                    'crop_name' => $conversation->planting->crop->name,
                    'crop_image' => $conversation->planting->crop->image_path,
                ] : null,
            ],
            'messages' => $messages->map(fn($msg) => [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'sender_name' => $msg->sender->name,
                'message' => $msg->message,
                'image_path' => $msg->image_path,
                'is_mine' => $msg->isSentBy($userId),
                'is_read' => $msg->isRead(),
                'sent_at' => $msg->created_at->format('M d, Y h:i A'),
            ])->toArray(),
        ];
    }
}
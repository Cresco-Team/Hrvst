<?php

namespace App\Services;

use App\Events\MessageRead;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Repositories\ConversationRepository;
use App\Repositories\MessageRepository;
use Illuminate\Http\UploadedFile;

class MessagingService
{
    public function __construct(
        protected ConversationRepository $conversationRepo,
        protected MessageRepository $messageRepo,
        protected ImageUploadService $imageService,
    ) {}

    public function startConversation(int $userId1, int $userId2, ?int $plantingId = null): Conversation
    {
        return $this->conversationRepo
            ->findOrCreateConversation($userId1, $userId2, $plantingId);
    }

    /**
     * Send a message in a conversation
     */
    public function sendMessage(
        int $conversationId, 
        int $senderId, 
        ?string $messageText = null, 
        ?UploadedFile $image = null, 
    ): Message {
        if (empty($messageText) && !$image) {
            throw new \InvalidArgumentException('Message must contain text or image');
        }

        $imagePath = null;
        if ($image) {
            $imagePath = $this->imageService->uploadMessageImage($image);
        }

        $message = $this->messageRepo->create([
            'conversation_id' => $conversationId,
            'sender_id' => $senderId,
            'message' => $messageText,
            'image_path' => $imagePath,
        ]);

        $this->conversationRepo->updateLastMessageTime($conversationId);

        broadcast(new MessageSent($message))->toOthers();

        return $message;
    }

    public function getUserConversations(int $userId): array
    {
        $conversations = $this->conversationRepo->getUserConversations($userId);

        return $conversations->map(function ($conversation) use ($userId) {
            $otherUser = $conversation->participants->first();

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
                'latest_message' => $conversation->latestMessage->first() ? [
                    'text' => $conversation->latestMessage->first()->message
                        ?? ($conversation->latestMessage->first()->image_path ? '📷 Image' : ''),
                    'sent_at' => $conversation->latestMessage->first()->created_at->diffForHumans(),
                ] : null,
                'unread_count' => $conversation->unread_count ?? 0,
                'last_message_at' => $conversation->last_message_at?->diffForHumans(),
            ];
        })->toArray();
    }

    public function getConversationMessages(int $conversationId, int $userId): array
    {
        $conversation = $this->conversationRepo->findById($conversationId);

        if (!$conversation || !$conversation->hasParticipant($userId)) {
            abort(403, 'Unauthorized access to conversation');
        }

        $conversation->markAsReadForUser($userId);

        broadcast(new MessageRead(
            $conversationId,
            $userId,
            now()->toIso8601String()
        ))->toOthers();

        $messages = $this->conversationRepo->getConversationMessages($conversationId);
        $otherUser = $conversation->getOtherParticipant($userId);

        return [
            'conversation' => [
                'id' => $conversation->id,
                'other_user' => [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
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
                'image_url' => $msg->image_url,
                'is_mine' => $msg->isSentBy($userId),
                'is_read' => $msg->isReadBy($otherUser->id),
                'sent_at' => $msg->created_at->format('M d, Y h:i A'),
            ])->toArray(),
        ];
    }
}
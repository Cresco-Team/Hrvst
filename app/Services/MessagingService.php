<?php

namespace App\Services;

use App\Models\Message;

class MessageRepository
{
    public function create(array $data): Message
    {
        return Message::create($data);
    }

    public function markAsRead(int $messageId): void
    {
        Message::where('id', $messageId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function markConversationAsRead(int $conversationId, int $userId): void
    {
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
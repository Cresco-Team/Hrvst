<?php

namespace App\Repositories;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ConversationRepository
{
    /**
     * Find or create conversation between two users about a specific planting
     */
    public function findOrCreateConversation(int $userId1, int $userId2, ?int $plantingId = null): Conversation
    {
        $query = Conversation::whereHas('participants', function ($q) use ($userId1) {
            $q->where('user_id', $userId1);
        })
        ->whereHas('participants', function ($q) use ($userId2) {
            $q->where('user_id', $userId2);
        })
        ->has('participants', '=', 2); // Ensure only 2 participants

        if ($plantingId) {
            $query->where('planting_id', $plantingId);
        } else {
            $query->whereNull('planting_id');
        }

        $conversation = $query->first();

        if ($conversation) {
            return $conversation;
        }

        $conversation = Conversation::create([
            'planting_id' => $plantingId,
            'last_message_at' => now(),
        ]);

        $conversation->addParticipant($userId1);
        $conversation->addParticipant($userId2);

        return $conversation;
    }

    public function getUserConversations(int $userId): Collection
    {
        return Conversation::whereHas('participants', fn($q) => $q->where('user_id', $userId))
        ->with([
            'participants' => fn($q) => $q->where('user_id', '!=', $userId),
            'planting.crop:id,name,image_path',
            'latestMessage' => fn($q) => $q->limit(1),
        ])
        ->withCount([
            'messages as unread_count' => function ($q) use ($userId) {
                $q->where('sender_id', '!=', $userId)
                    ->whereRaw('created_at > COALESCE(
                        (SELECT last_read_at FROM conversation_participants 
                         WHERE conversation_id = conversations.id 
                         AND user_id = ?),
                        conversations.created_at
                    )', [$userId]);
            }
        ])
        ->orderByDesc('last_message_at')
        ->get();
    }

    public function findById(int $conversationId): ?Conversation
    {
        return Conversation::with([
            'participants',
            'planting.crop:id,name,image_path',
        ])->find($conversationId);
    }

    public function updateLastMessageTime(int $conversationId): void
    {
        Conversation::where('id', $conversationId)
            ->update(['last_message_at' => now()]);
    }

    public function getConversationMessages(int $conversationId, int $limit = 50): Collection
    {
        return Conversation::findOrFail($conversationId)
            ->messages()
            ->with('sender:id,name')
            ->latest()
            ->limit($limit)
            ->get()
            ->reverse()
            ->values();
    }
}
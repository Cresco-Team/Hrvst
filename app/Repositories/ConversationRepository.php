<?php

namespace App\Repositories;

use App\Models\Conversation;
use Illuminate\Database\Eloquent\Collection;

class ConversationRepository
{
    public function findOrCreateConversation(int $dealerId, int $farmerId, ?int $plantingId = null): Conversation
    {
        return Conversation::firstOrCreate(
            [
                'dealer_id' => $dealerId,
                'farmer_id' => $farmerId,
                'planting_id' => $plantingId,
            ],
            [
                'last_message_at' => now(),
            ]
        );
    }

    public function getUserConversations(int $userId): Collection
    {
        return Conversation::with([
            'dealer:id,name,email',
            'farmer.user:id,name,email',
            'planting.crop:id,name,image_path',
            'latestMessage' => fn($q) => $q->limit(1),
        ])
        ->where('dealer_id', fn($q) => $q->where('user_id', $userId))
        ->orWhere('farmer_id', $userId)
        ->orderByDesc('last_message_at')
        ->get();
    }

    public function findById(int $conversationId): ?Conversation
    {
        return Conversation::with([
            'dealer:id,name',
            'farmer.user:id,name',
            'planting.crop:id,name,image_path',
        ])->find($conversationId);
    }

    public function updateLastMessageTime(int $conversationId): void
    {
        Conversation::where('id', $conversationId)
            ->update(['last_message_at' => now()]);
    }

    public function getConversationMessages(int $conversationId, int $perPage = 50): Collection
    {
        return Conversation::findOrFail($conversationId)
            ->messages()
            ->with('sender:id,name')
            ->latest()
            ->limit($perPage)
            ->get()
            ->reverse()
            ->values();
    }
}
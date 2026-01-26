<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'planting_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
            ->using(ConversationParticipant::class)
            ->withPivot(['last_read_at'])
            ->withTimestamps();
    }

    public function planting(): BelongsTo
    {
        return $this->belongsTo(FarmerCrop::class, 'planting_id', 'plant_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasMany
    {
        return $this->messages()->latest();
    }

    public function getOtherParticipant(int $userId): ?User
    {
        return $this->participants()
            ->where('user_id', '!=', $userId)
            ->first();
    }

    public function hasParticipant(int $userId): bool
    {
        return $this->participants()
            ->where('user_id', $userId)
            ->exists();
    }

    public function getUnreadCountForUser(int $userId): int
    {
        $participant = ConversationParticipant::where('conversation_id', $this->id)
            ->where('user_id', $userId)
            ->first();

        return $participant ? $participant->getUnreadCount() : 0;
    }

    public function markAsReadForUser(int $userId): void
    {
        ConversationParticipant::where('conversation_id', $this->id)
            ->where('user_id', $userId)
            ->update(['last_read_at' => now()]);
    }

    public function addParticipant(int $userId): void
    {
        $this->participants()->syncWithoutDetaching([$userId => [
            'created_at' => now(),
            'updated_at' => now(),
        ]]);
    }
}

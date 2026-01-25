<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'dealer_id',
        'farmer_id',
        'planting_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function dealer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dealer_id');
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class, 'farmer_id');
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

    /**
     * Get the other participant in the conversation
     */
    public function getOtherParticipant(int $userId): User
    {
        return $this->dealer_id === $userId ? $this->farmer->user : $this->dealer;
    }

    /**
     * Check if user is participant
     */
    public function hasParticipant(int $userId): bool
    {
        return $this->dealer_id === $userId || $this->farmer_id === $userId;
    }

    /**
     * Get unread messages count for a user
     */
    public function getUnreadCountForUser(int $userId): int
    {
        return $this->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->count();
    }

    /**
     * Mark all messages as read for a user
     */
    public function markAsReadForUser(int $userId): void
    {
        $this->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}

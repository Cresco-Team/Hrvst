<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConversationParticipant extends Model
{
    protected $fillable = [
        'conversation_id',
        'user_id',
        'last_read_at'
    ];

    protected $casts = [
        'last_recorded_at' => 'datetime',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markAsRead(): void
    {
        $this->update(['last_read_at' => now()]);
    }

    public function getUnreadCount(): int
    {
        return Message::where('conversation_id', $this->conversation_id)
            ->where('sender_id', '!=', $this->user_id)
            ->where('created_at', '>', $this->last_read_at ?? $this->created_at)
            ->count();
    }
}

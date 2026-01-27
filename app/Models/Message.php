<?php

namespace App\Models;

use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'message',
        'image_path',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    protected $appends = ['image_url'];


    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }
        /** @var Cloud $storage */
        $storage = Storage::disk('public');
        
        return $storage->url($this->image_path);
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    /**
     * Mark message as read
     */
    public function markAsRead(): void
    {
        if (!$this->isRead()) {
            $this->update(['read_at' => now()]);
        }
    }

    public function isSentBy(int $userId): bool
    {
        return $this->sender_id === $userId;
    }

    public function isReadBy(int $userId): bool
    {
        $participant = ConversationParticipant::where('conversation_id', $this->conversation_id)
            ->where('user_id', $userId)
            ->first();

            if (!$participant || !$participant->last_read_at) {
                return false;
            }

            return $this->created_at <= $participant->last_read_at;
    }
}

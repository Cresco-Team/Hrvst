<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MessagingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class MessageController extends Controller
{
    public function __construct(
        protected MessagingService $messagingService
    ) {}

    /**
     * Send a message (AJAX endpoint)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'conversation_id' => 'required|exists:conversations,id',
                'message' => 'nullable|string|max:5000',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB
            ]);

            // Verify user is participant
            $conversation = $this->messagingService
                ->startConversation(Auth::id(), Auth::id(), null); // Just to verify access
            
            if (!$conversation->hasParticipant(Auth::id())) {
                abort(403, 'Not authorized for this conversation');
            }

            $message = $this->messagingService->sendMessage(
                $validated['conversation_id'],
                Auth::id(),
                $validated['message'] ?? null,
                $request->file('image')
            );

            return response()->json([
                'success' => true,
                'message' => [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $message->sender->name,
                    'message' => $message->message,
                    'image_url' => $message->image_url,
                    'is_mine' => true,
                    'is_read' => false,
                    'sent_at' => $message->created_at->format('M d, Y h:i A'),
                    'created_at' => $message->created_at->toIso8601String(),
                ],
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Load more messages (pagination)
     */
    public function loadMore(Request $request, int $conversationId): JsonResponse
    {
        $validated = $request->validate([
            'before_id' => 'required|integer|exists:messages,id',
            'limit' => 'nullable|integer|min:10|max:100',
        ]);

        // Verify participant
        $conversation = \App\Models\Conversation::findOrFail($conversationId);
        
        if (!$conversation->hasParticipant(Auth::id())) {
            abort(403);
        }

        $messages = \App\Models\Message::where('conversation_id', $conversationId)
            ->where('id', '<', $validated['before_id'])
            ->with('sender:id,name')
            ->orderByDesc('id')
            ->limit($validated['limit'] ?? 50)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'success' => true,
            'messages' => $messages->map(fn($msg) => [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'sender_name' => $msg->sender->name,
                'message' => $msg->message,
                'image_url' => $msg->image_url,
                'is_mine' => $msg->isSentBy(Auth::id()),
                'sent_at' => $msg->created_at->format('M d, Y h:i A'),
            ])->toArray(),
            'has_more' => $messages->count() === ($validated['limit'] ?? 50),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\MessagingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DealerMessageController extends Controller
{
    public function __construct(
        protected MessagingService $messagingService
    ) {}

    /**
     * Show all dealer conversations
     */
    public function index(): Response
    {
        $conversations = $this->messagingService->getUserConversations(Auth::id());

        return Inertia::render('dealer-profile/messages/index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Show specific conversation with a farmer
     */
    public function show(int $farmerId, Request $request): Response
    {
        $plantingId = $request->query('planting_id');

        // Start or get existing conversation
        $conversation = $this->messagingService->startConversation(
            Auth::id(),
            $farmerId,
            $plantingId
        );

        // Get messages
        $data = $this->messagingService->getConversationMessages($conversation->id, Auth::id());

        return Inertia::render('dealer-profile/messages/show', $data);
    }

    /**
     * Send a message
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'message' => 'required|string|max:5000',
        ]);

        $message = $this->messagingService->sendMessage(
            $validated['conversation_id'],
            Auth::id(),
            $validated['message']
        );

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }
}
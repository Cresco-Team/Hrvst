<?php

namespace App\Http\Controllers;

use App\Services\MessagingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FarmerMessageController extends Controller
{
    public function __construct(
        protected MessagingService $messagingService
    ) {}

    /**
     * Show all farmer conversations
     */
    public function index(Request $request): Response
    {
        $conversations = $this->messagingService->getUserConversations(Auth::id());

        $selectedConversation = null;
        $messages = null;

        // If conversation_id is provided, load that conversation
        if ($request->has('conversation_id')) {
            $conversationId = (int) $request->query('conversation_id');
            $data = $this->messagingService->getConversationMessages($conversationId, Auth::id());
            
            $selectedConversation = $data['conversation'];
            $messages = $data['messages'];
        }

        return Inertia::render('farmer-profile/messages/index', [
            'conversations' => $conversations,
            'selectedConversation' => $selectedConversation,
            'messages' => $messages,
        ]);
    }

    /**
     * Show specific conversation with a dealer
     */
    public function show(int $conversationId): Response
    {
        $data = $this->messagingService->getConversationMessages($conversationId, Auth::id());

        return Inertia::render('farmer-profile/messages/show', $data);
    }

    /**
     * Send a message (reply to dealer)
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

        return back();
    }
}
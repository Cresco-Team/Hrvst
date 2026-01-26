<?php

namespace App\Http\Controllers;

use App\Services\MessagingService;
use Illuminate\Http\RedirectResponse;
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

        return Inertia::render('dealer-profile/messages/index', [
            'conversations' => $conversations,
            'selectedConversation' => $selectedConversation,
            'messages' => $messages,
        ]);
    }
    
    /**
     * Start conversation with farmer (redirects to index with conversation loaded)
     */
    public function startConversation(int $farmerId, Request $request): RedirectResponse
    {
        $plantingId = $request->query('planting_id');

        // Create or get existing conversation
        $conversation = $this->messagingService->startConversation(
            Auth::id(),
            $farmerId,
            $plantingId
        );

        // Redirect to index with conversation selected
        return redirect()->route('dealer.messages.index', [
            'conversation_id' => $conversation->id
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
    public function store(Request $request): RedirectResponse
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

        // Get updated messages for this conversation
        $data = $this->messagingService->getConversationMessages(
            $validated['conversation_id'],
            Auth::id()
        );

        return redirect()->route('dealer.messages.index', [
            'conversation_id' => $validated['conversation_id']
        ])->with([
            'messages' => $data['messages']
        ]);
    }
}
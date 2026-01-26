<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
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

    public function index(Request $request): Response
    {
        $conversations = $this->messagingService->getUserConversations(Auth::id());

        $selectedConversation = null;
        $messages = null;

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
    
    public function startConversation(int $farmerId, Request $request): RedirectResponse
    {
        $plantingId = $request->query('planting_id');

        $farmer = Farmer::with('user:id')->findOrFail($farmerId);

        $conversation = $this->messagingService->startConversation(
            Auth::id(),
            $farmer->user->id,
            $plantingId
        );

        return redirect()->route('dealer.messages.index', [
            'conversation_id' => $conversation->id
        ]);
    }

    public function show(int $farmerId, Request $request): Response
    {
        $plantingId = $request->query('planting_id');

        $conversation = $this->messagingService->startConversation(
            Auth::id(),
            $farmerId,
            $plantingId
        );

        $data = $this->messagingService->getConversationMessages($conversation->id, Auth::id());

        return Inertia::render('dealer-profile/messages/show', $data);
    }
}
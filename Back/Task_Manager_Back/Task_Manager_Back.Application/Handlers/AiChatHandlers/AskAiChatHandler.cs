using MediatR;
using Task_Manager_Back.Application.IServices;
using Task_Manager_Back.Application.Requests.AiChatRequests;

namespace Task_Manager_Back.Application.Handlers.AiChatHandlers;
public class AskAiChatHandler : IRequestHandler<AskAiChatRequest, string>
{
    private readonly IAskAiChatService _aiChatService;

    public AskAiChatHandler(IAskAiChatService aiChatService)
    {
        _aiChatService = aiChatService;
    }

    public async Task<string> Handle(AskAiChatRequest request, CancellationToken cancellationToken)
    {
        string response = await _aiChatService.AskAsync(request.Prompt);
        return response;
    }
}
using MediatR;

namespace Task_Manager_Back.Application.Requests.AiChatRequests;
public record AskAiChatRequest(
    string Prompt,
    Guid UserId

) : IRequest<string>;
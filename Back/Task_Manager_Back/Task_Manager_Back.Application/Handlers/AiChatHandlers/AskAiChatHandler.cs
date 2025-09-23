using MediatR;
using System.Text;
using Task_Manager_Back.Application.IServices;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.AiChatRequests;
using Task_Manager_Back.Domain.Entities.Enums;

namespace Task_Manager_Back.Application.Handlers.AiChatHandlers;

public class AskAiChatHandler : IRequestHandler<AskAiChatRequest, string>
{
    private readonly IAskAiChatService _aiChatService;
    private readonly ITaskRepository _taskRepository;

    public AskAiChatHandler(IAskAiChatService aiChatService, ITaskRepository taskRepository)
    {
        _aiChatService = aiChatService;
        _taskRepository = taskRepository;
    }

    public async Task<string> Handle(AskAiChatRequest request, CancellationToken cancellationToken)
    {
        // Fetch all tasks
        var tasks = await _taskRepository.GetAllAsync();

        // Build task list for prompt
        var sb = new StringBuilder();
        sb.AppendLine("Here are the current tasks:");
        foreach (var task in tasks)
        {
            sb.AppendLine($"- {task.Title} | Priority: {task.Priority?.ToString() ?? "none"} | Deadline: {task.Deadline?.ToString("yyyy-MM-dd") ?? "none"}");
        }

        sb.AppendLine();
        sb.AppendLine("User question: " + request.Prompt);

        // Ask AI
        string response = await _aiChatService.AskAsync(sb.ToString());
        return response;
    }
}

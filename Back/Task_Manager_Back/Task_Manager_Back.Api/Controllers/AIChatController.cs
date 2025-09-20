using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Infrastructure.Sevices.AI;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/chat")]
public class AIChatController : ControllerBase
{
    private readonly IAIChatService _aiChatService;

    public AIChatController(IAIChatService aiChatService)
    {
        _aiChatService = aiChatService;
    }

    [HttpPost]
    public async Task<IActionResult> Ask([FromBody] string question)
    {
        var response = await _aiChatService.AskAsync(question);
        return Ok(new { answer = response });
    }
}
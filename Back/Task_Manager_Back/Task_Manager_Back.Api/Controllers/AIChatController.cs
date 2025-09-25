using MediatR;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Application.Requests.AiChatRequests;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/ai-chat")]
public class AiChatController : Controller
{
    private readonly IMediator _mediator;

    public AiChatController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Ask the AI a question.
    /// </summary>
    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] AskAiChatRequest request, CancellationToken ct)
    {
        var response = await _mediator.Send(request, ct);
        return Ok(new { reply = response });
    }
}

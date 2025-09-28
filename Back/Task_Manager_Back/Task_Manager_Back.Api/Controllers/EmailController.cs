using MediatR;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Application.Requests;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/email")]
public class EmailController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmailController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("deadline")]
    public async Task<IActionResult> SendDeadlineReminder([FromBody] SendDeadlineReminderEmailRequest request)
    {
        await _mediator.Send(request);
        return Ok("Deadline reminder email sent.");
    }

    [HttpPost("reminder")]
    public async Task<IActionResult> SendReminder([FromBody] SendReminderEmailRequest request)
    {
        await _mediator.Send(request);
        return Ok("Reminder email sent.");
    }

    //[HttpGet("confirm")]
    //public async Task<IActionResult> Confirm([FromQuery] string token)
    //{
    //    var result = await _mediator.Send(new ConfirmEmailRequest(token));
    //    return result ? Ok("Email confirmed!") : BadRequest("Invalid or expired token.");
    //}
}

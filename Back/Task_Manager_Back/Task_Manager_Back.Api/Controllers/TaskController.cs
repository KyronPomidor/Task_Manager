using MediatR;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Application.Requests.TaskRequests;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskController : ControllerBase
{
    private readonly IMediator _mediator;

    public TaskController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
    {
        await _mediator.Send(request);
        return CreatedAtAction("s", new { guid = request.UserId }, request);
    }
    [HttpGet("{guid}")]
    [HttpGet]
    [HttpPut("{guid}")]
    [HttpDelete]
}

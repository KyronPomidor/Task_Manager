using MediatR;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Application.Commands.Tasks;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskEntityController : ControllerBase
{
    private readonly IMediator _mediator;

    public TaskEntityController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Create a new task.
    /// </summary>
    [HttpPost]
    public async Task<Guid> Create([FromBody] CreateTaskCommand command)
    {
        Guid TaskId = await _mediator.Send(command);
        // return CreatedAtAction(nameof(GetById), new { id = command.UserId }, command);
        // taler TODO: do below to work. But need to implement GetById first
        // right now just return Id.

        // yes, need validation and clear error handling here
        return TaskId;
    }
}
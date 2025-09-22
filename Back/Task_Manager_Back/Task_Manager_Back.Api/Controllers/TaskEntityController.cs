using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Api.ApiRequests.TaskApiRequests;
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
    [Authorize]
    public async Task<Guid> Create([FromBody] CreateTaskApiRequest request)
    {
         // Получаем UserId из identity
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (userIdClaim == null)
            throw new InvalidOperationException("User is not authenticated.");

        Guid userId = Guid.Parse(userIdClaim.Value);

        // to not mess the order of parameters, use named parameters
        CreateTaskCommand command = new CreateTaskCommand(
            UserId: userId,
            Title: request.Title,
            Description: request.Description,
            Color: request.Color, //TODO: do it optional
            PriorityId: request.PriorityId,
            StatusId: request.StatusId,
            CategoryId: request.CategoryId,
            Deadline: request.Deadline,
            LabelIds: request.LabelIds,
            OrderPosition: request.OrderPosition
        );


        Guid TaskId = await _mediator.Send(command);
        // return CreatedAtAction(nameof(GetById), new { id = command.UserId }, command);
        // taler TODO: do below to work. But need to implement GetById first
        // right now just return Id.

        // yes, need validation and clear error handling here
        return TaskId;
    }
}
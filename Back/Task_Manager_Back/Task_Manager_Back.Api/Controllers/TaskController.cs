using MediatR;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Application.Requests.TaskRequests;

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
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
    {
        await _mediator.Send(request);
        return CreatedAtAction(nameof(GetById), new { id = request.UserId }, request);
    }

    /// <summary>
    /// Get all tasks.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tasks = await _mediator.Send(new GetTasksRequest());
        return Ok(tasks);
    }

    /// <summary>
    /// Get a specific task by Id.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var task = await _mediator.Send(new GetTaskByIdRequest(id));
        return task is null ? NotFound() : Ok(task);
    }

    /// <summary>
    /// Update an entire task (PUT).
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskRequest request)
    {
        if (id != request.TaskId)
            return BadRequest("TaskId mismatch between route and body");

        await _mediator.Send(request);
        return NoContent();
    }

    /// <summary>
    /// Partially update a task (PATCH).
    /// </summary>
    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Patch(Guid id, [FromBody] PatchTaskRequest request)
    {
        if (id != request.TaskId)
            return BadRequest("TaskId mismatch between route and body");

        await _mediator.Send(request);
        return NoContent();
    }

    /// <summary>
    /// Delete a task by Id.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteTaskByIdRequest(id));
        return NoContent();
    }

    /// <summary>
    /// Add a reminder to a task.
    /// </summary>
    //[HttpPost("{taskId:guid}/reminders")]
    //public async Task<IActionResult> AddReminder(Guid taskId, [FromBody] AddTaskReminderRequest request)
    //{
    //    if (taskId != request.TaskId)
    //        return BadRequest("TaskId mismatch between route and body");

    //    var reminder = await _mediator.Send(request);
    //    return CreatedAtAction(nameof(GetById), new { id = taskId }, reminder);
    //}

    /// <summary>
    /// Add a relation between tasks.
    /// </summary>
    [HttpPost("{fromTaskId:guid}/relations/{toTaskId:guid}")]
    public async Task<IActionResult> AddRelation(Guid fromTaskId, Guid toTaskId)
    {
        await _mediator.Send(new AddTaskRelationRequest(fromTaskId, toTaskId));
        return NoContent();
    }

    /// <summary>
    /// Remove a relation between tasks.
    /// </summary>
    [HttpDelete("{fromTaskId:guid}/relations/{toTaskId:guid}")]
    public async Task<IActionResult> RemoveRelation(Guid fromTaskId, Guid toTaskId)
    {
        await _mediator.Send(new RemoveTaskRelationRequest(fromTaskId, toTaskId));
        return NoContent();
    }
}

using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Api.ApiRequests.TaskApiRequests;
using Task_Manager_Back.Application.Commands.Tasks;
using Task_Manager_Back.Application.Queries;
using Task_Manager_Back.Application.Queries.Tasks;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskEntityController : Controller
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
    //[Authorize] for demo keep it off, then add it back
    public async Task<Guid> Create([FromBody] CreateTaskApiRequest request)
    {
        // Получаем UserId из identity
        // var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        // if (userIdClaim == null)
        //     throw new InvalidOperationException("User is not authenticated.");

        // Guid userId = Guid.Parse(userIdClaim.Value);

        // to not mess the order of parameters, use named parameters
        CreateTaskCommand command = new CreateTaskCommand(
            UserId: request.UserId,
            Title: request.Title,
            Description: request.Description,
            Color: request.Color, //TODO: do it optional
            PriorityId: request.PriorityId,
            PriorityLevel: request.PriorityLevel, // TEMPORARY
            StatusId: request.StatusId,
            CategoryId: request.CategoryId, // Null means inbox
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

    /// <summary>
    /// Get All tasks for the authenticated user.
    /// </summary>
    /// <returns>List of tasks.</returns>
    [HttpGet]
    //[Authorize]
    public async Task<IActionResult> GetAll(Guid UserId)
    {
        // // Получаем UserId из identity
        // var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        // if (userIdClaim == null)
        //     return Unauthorized("User is not authenticated.");

        // Guid userId = Guid.Parse(userIdClaim.Value);

        // Here should be a query to get tasks by userId
        // For example:

        try
        {
            var tasks = await _mediator.Send(new GetTasksByUserIdQuery(UserId));

            // For now, return an empty list
            return Ok(tasks);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            // Log the exception (not shown here for brevity)
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }
    /// <summary>
    /// Get a task by its ID.
    /// </summary>
    /// <param name="id">The ID of the task to retrieve.</param>
    /// <returns>The task if found; otherwise, 404.</returns>
    /// <remarks>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var task = await _mediator.Send(new GetTaskByIdQuery(id));
            return Ok(task);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            // Log the exception (not shown here for brevity)
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    /// <summary>
    /// Delete a task by its ID.
    /// </summary>
    /// <param name="id">The ID of the task to delete.</param>
    /// <returns>200 if successful.</returns>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id) //DeleteTaskApiRequest for now not used for consistency
    {
        DeleteTaskCommand command = new DeleteTaskCommand(id); //userId later
        await _mediator.Send(command);
        return Ok(); // IDk to return Ok or NoContent. NoContent is used for delete usually, said me AI. 
    }


    /// <summary>
    /// Update an existing task.
    /// </summary>
    /// <param name="request">The task update request.</param>
    /// <returns>200 if successful.</returns>
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateTaskApiRequest request)
    {
        // Get UserId from identity
        // var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        // if (userIdClaim == null)
        //     return Unauthorized("User is not authenticated.");

        // Guid userId = Guid.Parse(userIdClaim.Value);

        var command = new UpdateTaskCommand(
            TaskId: request.TaskId,
            Title: request.Title,
            Description: request.Description,
            Color: request.Color,
            PriorityId: request.PriorityId,
            PriorityLevel: request.PriorityLevel,
            StatusId: request.StatusId,
            CategoryId: request.CategoryId,
            Deadline: request.Deadline,
            LabelIds: request.LabelIds,
            OrderPosition: request.OrderPosition,
            IsCompleted: request.IsCompleted,
            IsFailed: request.IsFailed,
            CompletedAt: request.CompletedAt,
            FailedAt: request.FailedAt
        );

        try
        {
            await _mediator.Send(command);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            // Log the exception (not shown here for brevity)
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    // This is for Dependency relations between tasks:
    /// <summary>
    /// Add a dependency relation between two tasks.
    /// </summary>
    /// <param name="request">The dependency relation request.</param>
    /// <returns>200 if successful.</returns>
    [HttpPost("add-dependency")]
    public async Task<IActionResult> AddDependency([FromBody] CreateTaskDependencyApiRequest request)
    {
        var command = new CreateTaskDependencyCommand(
            TaskId: request.TaskId,
            DependsOnTaskId: request.DependsOnTaskId
        );

        try
        {
            await _mediator.Send(command);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            // Log the exception (not shown here for brevity)
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    /// <summary>
    /// Remove a dependency relation between two tasks.
    /// </summary>
    /// <param name="request">The dependency removal request.</param>
    /// <returns>200 if successful.</returns>
    [HttpDelete("remove-dependency")]
    public async Task<IActionResult> RemoveDependency([FromBody] DeleteTaskDependencyApiRequest request)
    {
        var command = new DeleteTaskDependencyCommand(
            TaskId: request.TaskId,
            DependsOnTaskId: request.DependsOnTaskId
        );

        try
        {
            await _mediator.Send(command);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            // Log the exception (not shown here for brevity)
            return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
        }
    }

    /// <summary>
    /// Assign a task to a category.
    /// </summary>
    /// <param name="request">The category assignment request.</param>
    /// <returns>200 if successful.</returns>
    [HttpPatch("assign-category")]
    public async Task<IActionResult> AssignToCategory([FromBody] AssignTaskToCategoryApiRequest request)
    {
        var command = new AssignTaskToCategoryCommand(
            TaskId: request.TaskId,
            CategoryId: request.CategoryId
        );

        try
        {
            await _mediator.Send(command);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            // Log the exception (not shown here for brevity)
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }
}
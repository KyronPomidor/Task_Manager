using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Api.ApiRequests.TaskCategoryApiRequests;
using Task_Manager_Back.Application.Commands.TaskCategories;

namespace Task_Manager_Back.Api.Controllers;


[Route("api/[controller]")]
[ApiController]
public class TaskCategoryController : ControllerBase
{
    private readonly IMediator _mediator;

    public TaskCategoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Create a new task category.
    /// </summary>
    /// <param name="userId">The ID of the user creating the category.</param>
    /// <param name="title">The title of the category.</param>
    /// <param name="description">An optional description of the category.</param>
    /// <param name="parentCategoryId">An optional ID of the parent category.</param>
    /// <returns>The ID of the newly created category.</returns>
    /// <response code="200">Returns the ID of the newly created category.</response>
    /// <response code="400">If the request is invalid.</response>
    /// <response code="500">If there is an internal server error.</response>
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateTaskCategoryApiRequest request)
    {
        CreateTaskCategoryCommand command = new CreateTaskCategoryCommand(
            UserId: request.UserId,
            Title: request.Title,
            Description: request.Description,
            ParentCategoryId: request.ParentCategoryId
        );
        Guid categoryId = await _mediator.Send(command);
        return Ok(categoryId);
    }

}
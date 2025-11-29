using MediatR;
using Microsoft.AspNetCore.Mvc;
using Task_Manager_Back.Application.Requests;

using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class TaskCategoryController : Controller
{
    private readonly IMediator _mediator;

    public TaskCategoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get a specific user category by Id.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var category = await _mediator.Send(new GetTaskUserCategoryByIdRequest(id));
        return category is null ? NotFound() : Ok(category);
    }
    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetAllByUserId(Guid userId)
    {
        var categories = await _mediator.Send(new GetTaskUserCategoriesRequest(userId));
        return Ok(categories);
    }


    /// <summary>
    /// Get or create inbox category for a user.
    /// </summary>
    [HttpGet("inbox/{userId:guid}")]
    public async Task<IActionResult> GetOrCreateInbox(Guid userId)
    {
        var inboxCategory = await _mediator.Send(new GetOrCreateInboxByUserIdRequest(userId));
        return Ok(inboxCategory);
    }
    /// <summary>
    /// Create a new user category.
    /// </summary>
    [HttpPost("user")]
    public async Task<IActionResult> CreateUserCategory([FromBody] CreateTaskUserCategoryRequest request)
    {
        var categoryId = await _mediator.Send(request);

        return CreatedAtAction(nameof(GetById), new { id = categoryId }, new { id = categoryId });
    }
    [HttpPut("user/{categoryId:guid}")]
    public async Task<IActionResult> UpdateUserCategory(Guid categoryId, [FromBody] UpdateTaskUserCategoryRequest request)
    {
        if (categoryId != request.CategoryId)
            return BadRequest("CategoryId mismatch between route and body");

        await _mediator.Send(request);
        return NoContent();
    }

    [HttpPatch("user/{categoryId:guid}")]
    public async Task<IActionResult> PatchUserCategory(Guid categoryId, [FromBody] PatchTaskUserCategoryRequest request)
    {
        if (categoryId != request.CategoryId)
            return BadRequest("CategoryId mismatch between route and body");

        await _mediator.Send(request);
        return NoContent();
    }

    /// <summary>
    /// Rename a category.
    /// </summary>
    [HttpPut("{categoryId:guid}/rename")]
    public async Task<IActionResult> Rename(Guid categoryId, [FromBody] RenameTaskUserCategoryRequest request)
    {
        if (categoryId != request.CategoryId)
            return BadRequest("CategoryId mismatch between route and body");

        await _mediator.Send(request);
        return NoContent();
    }

    /// <summary>
    /// Change category color (only user categories).
    /// </summary>
    [HttpPut("{categoryId:guid}/color")]
    public async Task<IActionResult> ChangeColor(Guid categoryId, [FromBody] ChangeTaskUserCategoryColorRequest request)
    {
        if (categoryId != request.CategoryId)
            return BadRequest("CategoryId mismatch between route and body");

        await _mediator.Send(request);
        return NoContent();
    }

    /// <summary>
    /// Change parent category.
    /// </summary>
    [HttpPut("{categoryId:guid}/parent")]
    public async Task<IActionResult> ChangeParent(Guid categoryId, [FromBody] ChangeTaskCategoryParentRequest request)
    {
        if (categoryId != request.CategoryId)
            return BadRequest("CategoryId mismatch between route and body");

        await _mediator.Send(request);
        return NoContent();
    }

    /// <summary>
    /// Delete a category (Inbox cannot be deleted).
    /// </summary>
    [HttpDelete("{categoryId:guid}")]
    public async Task<IActionResult> DeleteById(Guid categoryId)
    {
        await _mediator.Send(new DeleteTaskUserCategoryRequest(categoryId));
        return NoContent();
    }
}

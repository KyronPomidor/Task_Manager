using Microsoft.AspNetCore.Mvc;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskController : ControllerBase
{
    [HttpPost]
    public Task<IActionResult> Create([FromBody] Create)
    [HttpGet("{guid}")]
    [HttpGet]
    [HttpPut("{guid}")]
    [HttpDelete]
}

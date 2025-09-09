using Microsoft.AspNetCore.Mvc;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskEntitiesController : ControllerBase
{
    [HttpPost]
    [HttpGet("{guid}")]
    [HttpGet]
    [HttpPut("{guid}")]
    [HttpDelete]
}

using Microsoft.AspNetCore.Mvc;

namespace Task_Manager_Back.Api.Controllers;
public interface IController<TCreateCommand, TUpdateCommand>
{

    Task<IActionResult> CreateAsync([FromBody] TCreateCommand command);
    Task<IActionResult> GetByIdAsync(Guid id);
    Task<IActionResult> GetAllAsync();
    Task<IActionResult> UpdateAsync(Guid id, [FromBody] TUpdateCommand command);
    Task<IActionResult> DeleteByIdAsync(Guid id);
}
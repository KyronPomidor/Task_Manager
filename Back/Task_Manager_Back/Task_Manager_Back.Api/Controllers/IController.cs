using Microsoft.AspNetCore.Mvc;

namespace Task_Manager_Back.Api.Controllers;
public interface IController<TCreateRequest, TUpdateRequest>
{

    Task<IActionResult> CreateAsync([FromBody] TCreateRequest request);
    Task<IActionResult> GetByIdAsync(Guid id);
    Task<IActionResult> GetAllAsync();
    Task<IActionResult> UpdateAsync(Guid id, [FromBody] TUpdateRequest request);
    Task<IActionResult> DeleteByIdAsync(Guid id);
}
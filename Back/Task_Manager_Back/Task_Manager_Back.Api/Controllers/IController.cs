using Microsoft.AspNetCore.Mvc;

namespace Task_Manager_Back.Api.Controllers;
public interface IController<TCreateRequest, TUpdateRequest, TPatchRequest>
{

    Task<IActionResult> Create([FromBody] TCreateRequest request);
    Task<IActionResult> GetByUserId(Guid userId);
    Task<IActionResult> GetAll();
    Task<IActionResult> Update(Guid id, [FromBody] TUpdateRequest request);
    Task<IActionResult> Patch(Guid id, [FromBody] TPatchRequest request);
    Task<IActionResult> DeleteById(Guid id);
}
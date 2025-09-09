using Microsoft.AspNetCore.Mvc;

namespace Task_Manager_Back.Api.Controllers;

[ApiController]
[Route("api/cart")]
public class ShopItemsController : ControllerBase
{
    [HttpPost]
    [HttpGet("{guid}")]
    [HttpGet]
    [HttpPut("{guid}")]
    [HttpDelete]
}

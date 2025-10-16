using System;

namespace Task_Manager_Back.Application.IServices;

// it is in application layer because the implementation is in Infrastructure and APi depends on infrastructure
// Infrastructure can not depend on Api, so, can not put it in Api layer
// Infrastructure depends on Application layer, so, the interface is here
public interface IJwtTokenService
{
    string GenerateJwtToken(Guid userId, string email, string username, string role);
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record CreateTaskRequest(
    Guid UserId,
    string Title,
    string? Description,
    string Color,
    Guid? StatusId,
    Guid? PriorityId,
    Guid CategoryId,
    DateTime? Deadline,
    List<Guid> LabelIds,
    int OrderPosion
); // no mediatR here. Just a simple DTO

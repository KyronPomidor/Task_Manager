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
    string Color, //TODO: do it optional
    Guid? PriorityId,
    int PriorityLevel,
    Guid? StatusId,
    Guid? CategoryId, // can be null, then task goes to "Inbox" category
    DateTime? Deadline,
    IEnumerable<Guid>? LabelIds,
    int OrderPosition
); // no mediatR here, it's just a data structure

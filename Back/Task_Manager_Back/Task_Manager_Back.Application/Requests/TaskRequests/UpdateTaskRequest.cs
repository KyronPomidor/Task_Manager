using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record UpdateTaskRequest(
    Guid TaskId,                          // required to identify the task
    string? Title = null,
    string? Description = null,
    string? Color = null,

    Guid? PriorityId = null,
    int? PriorityLevel = null,            // TEMP FIELD
    Guid? StatusId = null,
    Guid? CategoryId = null,

    DateTime? Deadline = null,
    IEnumerable<Guid>? LabelIds = null,

    int? OrderPosition = null,

    bool? IsCompleted = null,
    bool? IsFailed = null,
    DateTime? CompletedAt = null,
    DateTime? FailedAt = null
);
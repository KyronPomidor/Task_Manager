using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record UpdateTaskRequest
    (
    Guid TaskId,
    Guid UserId,
    string? NewTitle,
    string? NewDescription,
    Guid? NewStatusId,
    Guid? NewCategoryId,
    DateTime? NewDeadline,
    bool? IsCompleted,
    bool? IsFailed
    );

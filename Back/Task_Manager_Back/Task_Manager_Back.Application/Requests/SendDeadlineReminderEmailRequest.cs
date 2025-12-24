using MediatR;
using Task_Manager_Back.Domain.Entities.Enums;

namespace Task_Manager_Back.Application.Requests;

public record SendDeadlineReminderEmailRequest(
    Guid UserId,
    string FromEmail,
    string TaskTitle,
    string TaskDescription,
    TaskPriority Priority,
    DateTime Deadline
) : IRequest;

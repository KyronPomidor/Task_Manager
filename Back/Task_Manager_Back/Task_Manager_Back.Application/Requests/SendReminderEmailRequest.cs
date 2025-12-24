using MediatR;

namespace Task_Manager_Back.Application.Requests;
public record SendReminderEmailRequest(
    Guid UserId,
    string FromEmail,
    string TaskTitle,
    string? TaskDescription,
    DateTime ReminderTime
) : IRequest;
using MediatR;
using Task_Manager_Back.Application.IServices;
using Task_Manager_Back.Application.Requests;

namespace Task_Manager_Back.Application.Handlers;

public class SendReminderEmailHandler : IRequestHandler<SendReminderEmailRequest>
{
    private readonly IEmailService _emailService;

    public SendReminderEmailHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task Handle(SendReminderEmailRequest request, CancellationToken cancellationToken)
    {
        var subject = $"🔔 Reminder: {request.TaskTitle}";
        var body = $@"
            <h2>Task Reminder</h2>
            <p><b>Title:</b> {request.TaskTitle}</p>
            {(string.IsNullOrWhiteSpace(request.TaskDescription) ? "" : $"<p><b>Description:</b> {request.TaskDescription}</p>")}
            <p><b>Reminder Time:</b> {request.ReminderTime:yyyy-MM-dd HH:mm}</p>
        ";

        await _emailService.SendEmailAsync(request.FromEmail, subject, body);

    }
}

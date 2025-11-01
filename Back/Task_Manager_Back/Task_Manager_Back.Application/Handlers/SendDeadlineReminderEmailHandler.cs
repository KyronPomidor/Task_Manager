using MediatR;
using Task_Manager_Back.Application.IServices;
using Task_Manager_Back.Application.Requests;

namespace Task_Manager_Back.Application.Handlers.EmailHandlers;

public class SendDeadlineReminderEmailHandler : IRequestHandler<SendDeadlineReminderEmailRequest>
{
    private readonly IEmailService _emailService;

    public SendDeadlineReminderEmailHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task Handle(SendDeadlineReminderEmailRequest request, CancellationToken cancellationToken)
    {

        var subject = $"⏰ Task deadline approaching: {request.TaskTitle}";
        var body = $@"
            <h2>Deadline Reminder</h2>
            <p><b>Title:</b> {request.TaskTitle}</p>
            <p><b>Description:</b> {request.TaskDescription}</p>
            <p><b>Priority:</b> {request.Priority}</p>
            <p><b>Deadline:</b> {request.Deadline:yyyy-MM-dd HH:mm}</p>
        ";

        await _emailService.SendEmailAsync(request.FromEmail, subject, body);

    }
}

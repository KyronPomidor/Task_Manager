namespace Task_Manager_Back.Application.IServices;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    //Task SendEmailConfirmationAsync(Guid userId, string email, string confirmationLink);
}

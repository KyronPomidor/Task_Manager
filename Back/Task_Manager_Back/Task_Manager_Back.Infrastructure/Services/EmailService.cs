using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using Task_Manager_Back.Application.IServices;

namespace Task_Manager_Back.Infrastructure.Services;



public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(
            _config["Email:SenderName"],
            _config["Email:SenderEmail"]
        ));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;

        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        await client.ConnectAsync(
            _config["Email:SmtpServer"],
            int.Parse(_config["Email:SmtpPort"]),
            MailKit.Security.SecureSocketOptions.None
        );

        // Mailpit doesn't need authentication
        // await client.AuthenticateAsync("username", "password"); 

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}

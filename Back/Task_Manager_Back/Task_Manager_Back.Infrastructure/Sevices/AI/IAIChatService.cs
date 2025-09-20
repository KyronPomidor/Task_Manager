namespace Task_Manager_Back.Infrastructure.Sevices.AI;
public interface IAIChatService
{
    Task<string> AskAsync(string prompt);
}

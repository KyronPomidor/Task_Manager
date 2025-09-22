namespace Task_Manager_Back.Application.IServices;
public interface IAiChatService
{
    Task<string> AskAsync(string prompt);
}

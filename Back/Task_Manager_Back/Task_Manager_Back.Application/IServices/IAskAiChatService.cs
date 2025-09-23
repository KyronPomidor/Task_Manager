namespace Task_Manager_Back.Application.IServices;
public interface IAskAiChatService
{
    Task<string> AskAsync(string prompt);
}

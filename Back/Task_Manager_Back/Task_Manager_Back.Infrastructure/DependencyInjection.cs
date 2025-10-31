using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Task_Manager_Back.Application.IServices;
using Task_Manager_Back.Infrastructure.Services.Ai;

namespace Task_Manager_Back.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services)
    {
        services.AddHttpClient<IAskAiChatService, AskAiChatService>();
        return services;
    }
}

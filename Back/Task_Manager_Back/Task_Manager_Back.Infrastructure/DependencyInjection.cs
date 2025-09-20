using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Task_Manager_Back.Infrastructure.Sevices.AI;

namespace Task_Manager_Back.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services, IConfiguration config)
    {
        services.AddHttpClient<IAIChatService, AIChatService>();
        return services;
    }
}

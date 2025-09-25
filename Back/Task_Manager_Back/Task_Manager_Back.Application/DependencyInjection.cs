using Microsoft.Extensions.DependencyInjection;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

namespace Task_Manager_Back.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register Task use cases
        services.AddScoped<GetTaskByIdUseCase>();
        services.AddScoped<GetTasksUseCase>();
        services.AddScoped<CreateTaskUseCase>();
        services.AddScoped<UpdateTaskUseCase>();
        services.AddScoped<PatchTaskUseCase>();
        services.AddScoped<DeleteTaskByIdUseCase>();
        services.AddScoped<AddTaskRelationUseCase>();
        services.AddScoped<RemoveTaskRelationUseCase>();
        services.AddScoped<AddTaskLabelUseCase>();
        services.AddScoped<AddTaskReminderUseCase>();
        services.AddScoped<AttachTaskFileUseCase>();
        services.AddScoped<ChangeTaskColorUseCase>();
        services.AddScoped<GetTaskUserCategoryByIdUseCase>();

        // Register Category use cases
        services.AddScoped<CreateTaskUserCategoryUseCase>();
        services.AddScoped<RenameTaskUserCategoryUseCase>();
        services.AddScoped<DeleteTaskUserCategoryUseCase>();
        services.AddScoped<UpdateTaskUserCategoryDescriptionUseCase>();
        services.AddScoped<ChangeTaskUserCategoryColorUseCase>();
        services.AddScoped<ChangeTaskUserCategoryParentUseCase>();
        services.AddScoped<GetTaskUserCategoriesUseCase>();
        services.AddScoped<UpdateTaskUserCategoryUseCase>();
        services.AddScoped<PatchTaskUserCategoryUseCase>();

        return services;
    }
}

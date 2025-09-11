using Scalar.AspNetCore;
using Task_Manager_Back.Application;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ---------------------
// Add services to the container
// ---------------------

builder.Services.AddControllers();

// Add EF Core DbContext
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add MediatR 
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(
        typeof(AssemblyReference).Assembly)
);
// Register repositories
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
//builder.Services.AddScoped<ITaskRelationRepository, TaskRelationRepository>();

// Register use cases
builder.Services.AddScoped<CreateTaskUseCase>();
builder.Services.AddScoped<UpdateTaskUseCase>();
builder.Services.AddScoped<DeleteTaskByIdUseCase>();
builder.Services.AddScoped<GetTaskByIdUseCase>();
builder.Services.AddScoped<GetTasksUseCase>();
builder.Services.AddScoped<AddTaskRelationUseCase>();
builder.Services.AddScoped<RemoveTaskRelationUseCase>();
builder.Services.AddScoped<AddTaskReminderUseCase>();
builder.Services.AddScoped<AttachTaskFileUseCase>();

// OpenAPI / Swagger
builder.Services.AddOpenApi();

// ---------------------
// Build app
// ---------------------
var app = builder.Build();

// ---------------------
// Configure the HTTP request pipeline
// ---------------------
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

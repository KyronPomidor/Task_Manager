using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Task_Manager_Back.Application;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Graph.Services;
using Task_Manager_Back.Domain.IServices.ITask;
using Task_Manager_Back.Infrastructure;
using Task_Manager_Back.Infrastructure.DbContext;
using Task_Manager_Back.Infrastructure.Repositories;
using Task_Manager_Back.Infrastructure.Seeds;

var builder = WebApplication.CreateBuilder(args);


// Load optional local settings if exists
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// ---------------------
// Add services to the container
// ---------------------

builder.Services.AddControllers();

// Add EF Core DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Seeder
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Add MediatR 
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(
        typeof(AssemblyReference).Assembly)
);
// Register repositories
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskRelationRepository, TaskRelationRepository>();

builder.Services.AddScoped<ITaskGraphService, TaskGraphService>();
builder.Services.AddScoped<ITaskCategoryRepository, TaskCategoryRepository>();
// Register use cases
builder.Services.AddApplicationServices();
// Register Infrastructure services
builder.Services.AddInfrastructureServices();
// OpenAPI / Swagger
builder.Services.AddOpenApi();

// ---------------------
// Build app
// ---------------------
var app = builder.Build();

// --- Call seeding logic here ---
await AppDbSeeder.SeedAsync(app.Services);
// ---------------------
// Configure the HTTP request pipeline
// ---------------------
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
    builder.Configuration.AddUserSecrets<Program>();
}

app.UseCors("AllowFrontend");  // <-- add this line
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

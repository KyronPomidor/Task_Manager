using Scalar.AspNetCore;
using MediatR;
using Task_Manager_Back.Application;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Domain.IRepositories;
using Task_Manager_Back.Infrastructure.Repositories;
using Task_Manager_Back.Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load optional local settings if exists
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:7167", "http://localhost:5053", "http://localhost:3000")
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


// Seeder TODO: later
// builder.Services.AddIdentity<IdentityUser, IdentityRole>()
//     .AddEntityFrameworkStores<AppDbContext>()
//     .AddDefaultTokenProviders();

// Add MediatR 
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(
        typeof(AssemblyReference).Assembly)
);

// Register repositories
builder.Services.AddTransient<ITaskRepository, TaskRepository>();

// Register use cases
builder.Services.AddTransient<CreateTaskUseCase>();


// OpenAPI / Swagger
builder.Services.AddOpenApi();

// ---------------------
// Build app
// ---------------------
var app = builder.Build();

// --- Call seeding logic here ---
// TODO: add later
// await AppDbSeeder.SeedAsync(app.Services);

// ---------------------
// Configure the HTTP request pipeline
// ---------------------
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
    builder.Configuration.AddUserSecrets<Program>(); // TOASK: what is that and why?
}
app.UseCors("AllowFrontend");  // allow CORS for the frontend app
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

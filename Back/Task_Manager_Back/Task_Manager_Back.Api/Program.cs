using Scalar.AspNetCore;
using MediatR;
using Task_Manager_Back.Application;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Domain.IRepositories;
using Task_Manager_Back.Infrastructure.Repositories;
using Task_Manager_Back.Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Task_Manager_Back.Infrastructure.DatabaseEntities;
using Task_Manager_Back.Application.IServices;
using Task_Manager_Back.Infrastructure.Services.Auth;
using Task_Manager_Back.Infrastructure.Seeds;

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

// Add Identity + JWT
builder.Services.AddScoped<IJwtTokenService, CustomJwtTokenService>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAuthenticatedUser", policy =>
        policy.RequireAuthenticatedUser());
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(jwtOptions =>
{
    jwtOptions.Authority = builder.Configuration["Jwt:Authority"];
    jwtOptions.Audience = builder.Configuration["Jwt:Audience"];
    jwtOptions.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]
            ?? throw new Exception("Missing jwt key config.")))

    };

    jwtOptions.MapInboundClaims = false;
});

// Add MediatR 
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(
        typeof(AssemblyReference).Assembly)
);

// Register repositories
builder.Services.AddTransient<ITaskRepository, TaskRepository>();

// Register use cases
builder.Services.AddTransient<CreateTaskUseCase>();
builder.Services.AddTransient<GetTasksByUserIdUseCase>();


// OpenAPI / Swagger
builder.Services.AddOpenApi();

// ---------------------
// Build app
// ---------------------
var app = builder.Build();

// --- Call seeding logic here ---
// TODO: add later, done TODO.
// --- Call seeding logic here ---
using (var scope = app.Services.CreateScope())
{
    await AppDbSeeder.SeedAsync(scope.ServiceProvider);
}

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

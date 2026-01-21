namespace Task_Manager_Back.Infrastructure.Services.Ai;

using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Task_Manager_Back.Application.IServices;

public class AskAiChatService : IAskAiChatService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _aiBaseUrl;
    private readonly string _model;
    private readonly string _backendBaseUrl;

    public AskAiChatService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _apiKey = "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";
        _aiBaseUrl = config["AI:BaseUrl"]!;
        _model = config["AI:Model"]!;
        _backendBaseUrl = "http://localhost:5053/api";
    }

    public async Task<string> AskAsync(string prompt)
    {
        var aiJson = await CallAi(prompt);
        return await ExecutePlan(aiJson);
    }

    // ================= AI =================

    private async Task<string> CallAi(string prompt)
    {
        var request = new
        {
            model = _model,
            messages = new[]
            {
                new
                {
                    role = "system",
                    content =
@"You are a task manager assistant.

Respond ONLY with valid JSON:

{
  ""message"": ""text for user"",
  ""actions"": [
    { ""type"": ""create_category"", ""title"": ""string"" },
    { ""type"": ""create_task"", ""title"": ""string"", ""description"": ""string"" }
  ]
}

Rules:
- Do NOT include ids
- Do NOT include userId
- Do NOT include colors
- Tasks after a category belong to that category
- No markdown"
                },
                new { role = "user", content = prompt }
            },
            max_tokens = 1200
        };

        var httpRequest = new HttpRequestMessage(HttpMethod.Post, _aiBaseUrl)
        {
            Content = new StringContent(
                JsonSerializer.Serialize(request),
                Encoding.UTF8,
                "application/json")
        };

        httpRequest.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", _apiKey);

        var response = await _httpClient.SendAsync(httpRequest);
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);

        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()!;
    }

    // ================= EXECUTION =================

    private async Task<string> ExecutePlan(string aiJson)
    {
        using var doc = JsonDocument.Parse(aiJson);
        var root = doc.RootElement;

        var message = root.GetProperty("message").GetString() ?? "";
        var actions = root.GetProperty("actions");

        var userId = GetUserId();               // demo
        Guid? currentCategoryId = null;
        int position = 0;

        foreach (var action in actions.EnumerateArray())
        {
            var type = action.GetProperty("type").GetString();

            switch (type)
            {
                case "create_category":
                    currentCategoryId = await CreateCategory(userId, action);
                    break;

                case "create_task":
                    if (currentCategoryId == null)
                        throw new InvalidOperationException("Task without category");

                    await CreateTask(
                        userId,
                        currentCategoryId.Value,
                        action,
                        position++
                    );
                    break;
            }
        }

        return message;
    }

    // ================= DOMAIN MAPPING =================

    private async Task<Guid> CreateCategory(Guid userId, JsonElement action)
    {
        var dto = new
        {
            UserId = userId,
            Title = action.GetProperty("title").GetString(),
            Description = (string?)null,
            ParentCategoryId = (Guid?)null,
            Color = "#4F46E5" // safe default
        };

        var response = await Post(
            $"{_backendBaseUrl}/categories/user",
            dto
        );

        var json = await response.Content.ReadAsStringAsync();
        return JsonDocument.Parse(json)
            .RootElement
            .GetProperty("id")
            .GetGuid();
    }

    private async Task CreateTask(
        Guid userId,
        Guid categoryId,
        JsonElement action,
        int position
    )
    {
        var dto = new
        {
            UserId = userId,
            Title = action.GetProperty("title").GetString(),
            Description = action.TryGetProperty("description", out var d)
                ? d.GetString()
                : null,
            Color = "#22C55E",
            StatusId = (Guid?)null,
            CategoryId = categoryId,
            Location = (object?)null,
            Priority = (object?)null,
            Deadline = (DateTime?)null,
            IsCompleted = false,
            PositionOrder = position,
            Price = (int?)null,
            DependsOnTasksIds = (List<Guid>?)null
        };

        await Post($"{_backendBaseUrl}/tasks", dto);
    }

    // ================= HTTP =================

    private async Task<HttpResponseMessage> Post(string url, object body)
    {
        var response = await _httpClient.PostAsync(
            url,
            new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"));

        response.EnsureSuccessStatusCode();
        return response;
    }

    // ================= DEMO =================

    private Guid GetUserId()
    {
        // replace with auth context later
        return Guid.Parse("39714763-624d-5931-6435-4a4e6e704e61");
    }
}

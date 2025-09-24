namespace Task_Manager_Back.Infrastructure.Services.Ai;

using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Task_Manager_Back.Application.IServices;

public class AskAiChatService : IAskAiChatService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _baseUrl;
    private readonly string _model;

    public AskAiChatService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _apiKey = config["AI:ApiKey"] ?? string.Empty;
        _baseUrl = config["AI:BaseUrl"] ?? string.Empty;
        _model = config["AI:Model"] ?? string.Empty;
    }

    public async Task<string> AskAsync(string prompt)
    {
        var request = new
        {
            model = _model, // e.g. "sonar"
            messages = new[]
            {
                new { role = "system", content = "You are a helpful task manager assistant. Respond accordingly only to the prompts related to tasks that user has." },
                new { role = "user", content = prompt }
            },
            max_tokens = 200
        };

        var json = JsonSerializer.Serialize(request);
        var httpRequest = new HttpRequestMessage(HttpMethod.Post, _baseUrl)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        var response = await _httpClient.SendAsync(httpRequest);
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);

        return doc?.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "No response, api key / base url / model may be missing";
    }
}

using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskRequests;

public record ChangeTaskColorRequest(Guid TaskId, string NewColor) : IRequest;

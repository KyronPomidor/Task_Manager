using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;

public class PatchTaskHandler : IRequestHandler<PatchTaskRequest>
{
    private readonly PatchTaskUseCase _useCase;

    public PatchTaskHandler(PatchTaskUseCase useCase)
    {
        _useCase = useCase;
    }

    public async Task Handle(PatchTaskRequest request, CancellationToken cancellationToken)
    {

        await _useCase.ExecuteAsync(request);
    }
}

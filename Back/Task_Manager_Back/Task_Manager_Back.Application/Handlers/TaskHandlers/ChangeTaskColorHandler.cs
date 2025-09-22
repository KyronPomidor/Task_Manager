using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;

public class ChangeTaskColorHandler : IRequestHandler<ChangeTaskColorRequest>
{
    private readonly ChangeTaskColorUseCase _useCase;

    public ChangeTaskColorHandler(ChangeTaskColorUseCase useCase)
    {
        _useCase = useCase;
    }

    public async Task Handle(ChangeTaskColorRequest request, CancellationToken cancellationToken)
    {
        await _useCase.ExecuteAsync(request);
    }
}

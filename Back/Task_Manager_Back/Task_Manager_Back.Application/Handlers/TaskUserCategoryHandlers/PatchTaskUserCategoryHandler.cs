using MediatR;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;

public class PatchTaskUserCategoryHandler : IRequestHandler<PatchTaskUserCategoryRequest>
{
    private readonly PatchTaskUserCategoryUseCase _useCase;

    public PatchTaskUserCategoryHandler(PatchTaskUserCategoryUseCase useCase)
    {
        _useCase = useCase;
    }

    public async Task Handle(PatchTaskUserCategoryRequest request, CancellationToken cancellationToken)
    {
        await _useCase.ExecuteAsync(request);
    }
}

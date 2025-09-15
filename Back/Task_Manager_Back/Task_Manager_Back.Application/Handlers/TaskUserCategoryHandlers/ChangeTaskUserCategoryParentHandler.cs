using MediatR;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskCategoryHandlers;
public class ChangeTaskUserCategoryParentHandler : IRequestHandler<ChangeTaskCategoryParentRequest>
{
    private readonly ChangeTaskUserCategoryParentUseCase _useCase;
    public ChangeTaskUserCategoryParentHandler(ChangeTaskUserCategoryParentUseCase useCase) => _useCase = useCase;
    public async Task Handle(ChangeTaskCategoryParentRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}
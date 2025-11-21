using MediatR;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;
public class ChangeTaskUserCategoryParentHandler : IRequestHandler<ChangeTaskCategoryParentRequest>
{
    private readonly ChangeTaskUserCategoryParentUseCase _useCase;
    public ChangeTaskUserCategoryParentHandler(ChangeTaskUserCategoryParentUseCase useCase) => _useCase = useCase;
    public async Task Handle(ChangeTaskCategoryParentRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}
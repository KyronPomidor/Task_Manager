using MediatR;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;
public class ChangeTaskUserCategoryColorHandler : IRequestHandler<ChangeTaskUserCategoryColorRequest>
{
    private readonly ChangeTaskUserCategoryColorUseCase _useCase;
    public ChangeTaskUserCategoryColorHandler(ChangeTaskUserCategoryColorUseCase useCase) => _useCase = useCase;
    public async Task Handle(ChangeTaskUserCategoryColorRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}
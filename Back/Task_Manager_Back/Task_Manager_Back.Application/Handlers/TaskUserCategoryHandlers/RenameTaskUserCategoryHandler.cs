using MediatR;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;
public class RenameTaskUserCategoryHandler : IRequestHandler<RenameTaskUserCategoryRequest>
{
    private readonly RenameTaskUserCategoryUseCase _useCase;
    public RenameTaskUserCategoryHandler(RenameTaskUserCategoryUseCase useCase) => _useCase = useCase;
    public async Task Handle(RenameTaskUserCategoryRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}
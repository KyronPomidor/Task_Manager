using MediatR;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskCategoryHandlers;
public class RenameTaskUserCategoryHandler : IRequestHandler<RenameTaskUserCategoryRequest>
{
    private readonly RenameTaskUserCategoryUseCase _useCase;
    public RenameTaskUserCategoryHandler(RenameTaskUserCategoryUseCase useCase) => _useCase = useCase;
    public async Task Handle(RenameTaskUserCategoryRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}
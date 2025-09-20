using MediatR;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;
public class DeleteTaskUserCategoryHandler : IRequestHandler<DeleteTaskUserCategoryRequest>
{
    private readonly DeleteTaskUserCategoryUseCase _useCase;
    public DeleteTaskUserCategoryHandler(DeleteTaskUserCategoryUseCase useCase) => _useCase = useCase;
    public async Task Handle(DeleteTaskUserCategoryRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}
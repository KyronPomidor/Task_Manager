using MediatR;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskCategoryHandlers;
public class CreateTaskUserCategoryHandler : IRequestHandler<CreateTaskUserCategoryRequest>
{
    private readonly CreateTaskUserCategoryUseCase _useCase;
    public CreateTaskUserCategoryHandler(CreateTaskUserCategoryUseCase useCase) => _useCase = useCase;
    public async Task Handle(CreateTaskUserCategoryRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}

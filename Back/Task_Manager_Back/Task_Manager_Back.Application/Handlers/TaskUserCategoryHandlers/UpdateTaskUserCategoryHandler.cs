using MediatR;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;

public class UpdateTaskUserCategoryHandler : IRequestHandler<UpdateTaskUserCategoryRequest>
{
    private readonly UpdateTaskUserCategoryUseCase _useCase;

    public UpdateTaskUserCategoryHandler(UpdateTaskUserCategoryUseCase useCase)
    {
        _useCase = useCase;
    }

    public async Task Handle(UpdateTaskUserCategoryRequest request, CancellationToken cancellationToken)
    {
        await _useCase.ExecuteAsync(request);
    }
}

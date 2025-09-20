using MediatR;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;

public class GetTaskUserCategoryByIdHandler
    : IRequestHandler<GetTaskUserCategoryByIdRequest, TaskUserCategory?>
{
    private readonly GetTaskUserCategoryByIdUseCase _useCase;

    public GetTaskUserCategoryByIdHandler(GetTaskUserCategoryByIdUseCase useCase)
    {
        _useCase = useCase;
    }

    public async Task<TaskUserCategory?> Handle(
        GetTaskUserCategoryByIdRequest request,
        CancellationToken cancellationToken)
    {
        return (TaskUserCategory?) await  _useCase.ExecuteAsync(request.CategoryId, cancellationToken);
    }
}

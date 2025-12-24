using MediatR;
using System.Collections.Generic;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;

public class GetTaskUserCategoriesHandler
    : IRequestHandler<GetTaskUserCategoriesRequest, IReadOnlyList<TaskUserCategory>>
{
    private readonly GetTaskUserCategoriesUseCase _useCase;

    public GetTaskUserCategoriesHandler(GetTaskUserCategoriesUseCase useCase)
    {
        _useCase = useCase;
    }

    public async Task<IReadOnlyList<TaskUserCategory>> Handle(
        GetTaskUserCategoriesRequest request,
        CancellationToken cancellationToken)
    {
        return await _useCase.ExecuteAsync(request, cancellationToken);
    }
}

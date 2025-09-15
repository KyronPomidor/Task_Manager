using MediatR;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskCategoryHandlers;
public class UpdateTaskUserCategoryDescriptionHandler : IRequestHandler<UpdateTaskUserCategoryDescriptionRequest>
{
    private readonly UpdateTaskUserCategoryDescriptionUseCase _useCase;
    public UpdateTaskUserCategoryDescriptionHandler(UpdateTaskUserCategoryDescriptionUseCase useCase) => _useCase = useCase;
    public async Task Handle(UpdateTaskUserCategoryDescriptionRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}
using MediatR;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskUserCategoryHandlers;
public class UpdateTaskUserCategoryDescriptionHandler : IRequestHandler<UpdateTaskUserCategoryDescriptionRequest>
{
    private readonly UpdateTaskUserCategoryDescriptionUseCase _useCase;
    public UpdateTaskUserCategoryDescriptionHandler(UpdateTaskUserCategoryDescriptionUseCase useCase) => _useCase = useCase;
    public async Task Handle(UpdateTaskUserCategoryDescriptionRequest request, CancellationToken cancellationToken)
        => await _useCase.ExecuteAsync(request);
}
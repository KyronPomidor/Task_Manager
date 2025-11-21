using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;
public class AttachTaskFileHandler : IRequestHandler<AttachTaskFileRequest>
{
    private readonly AttachTaskFileUseCase attachTaskFileUseCase;

    public AttachTaskFileHandler(AttachTaskFileUseCase attachTaskFileUseCase)
    {
        this.attachTaskFileUseCase = attachTaskFileUseCase;
    }

    public Task Handle(AttachTaskFileRequest request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class ChangeTaskColorUseCase
{
    private readonly ITaskRepository _repository;

    public ChangeTaskColorUseCase(ITaskRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(ChangeTaskColorRequest request)
    {
        var task = await _repository.GetByIdAsync(request.TaskId) 
            ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");
        task.ChangeColor(request.NewColor);

        await _repository.UpdateAsync(task);
    }
}

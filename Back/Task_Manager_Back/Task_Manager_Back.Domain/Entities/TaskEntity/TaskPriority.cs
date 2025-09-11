using System;

namespace Task_Manager_Back.Domain.Entities.TaskEntity;

public class TaskPriority
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public int Level { get; private set; } // e.g., 1 for High, 2 for Medium, 3 for Low

    public TaskPriority(Guid id, string name, int level)
    {
        Id = id;
        Name = name;
        Level = level;
    }
}

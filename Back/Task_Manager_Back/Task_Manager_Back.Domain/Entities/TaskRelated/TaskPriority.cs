using System;

namespace Task_Manager_Back.Domain.Entities.TaskEntity;

public class TaskPriority
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; } // to know which user this priority belongs to
    public string Name { get; private set; }
    public int Level { get; private set; } // e.g., 1 for High, 2 for Medium, 3 for Low

    public TaskPriority(Guid userId, string name, int level)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Name = name;
        Level = level;
    }

    public static TaskPriority LoadFromPersistence(Guid id, Guid userId, string name, int level)
    {
        var priority = new TaskPriority(userId, name, level);
        priority.Id = id; // hmmm, does that mean we make Guid ditry? Yes. In future need to make normal loading with empty constructor.
        // for now it has no sense to rewrite.
        return priority;
    }

}

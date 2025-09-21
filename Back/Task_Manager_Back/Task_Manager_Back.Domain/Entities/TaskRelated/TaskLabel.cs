using System;

namespace Task_Manager_Back.Domain.Entities.TaskEntity;


public class TaskLabel
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; } // to know which user this label belongs to
    public string Name { get; private set; }
    public string Color { get; private set; } // just for fun

    public TaskLabel(Guid userId, string name, string color)
    {
        UserId = userId;
        Id = Guid.NewGuid();
        Name = name;
        Color = color;
    }

    public static TaskLabel LoadFromPersistence(Guid id,Guid userId, string name, string color)
    {
        var label = new TaskLabel(userId, name, color);
        label.Id = id;
        return label;

        //either this, or to add an empty constructor
    }

}

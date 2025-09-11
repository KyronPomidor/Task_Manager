using System;

namespace Task_Manager_Back.Domain.Entities.TaskEntity;


public class TaskLabel
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Color { get; private set; } // just for fun

    public TaskLabel(Guid id, string name, string color)
    {
        Id = id;
        Name = name;
        Color = color;
    }

}

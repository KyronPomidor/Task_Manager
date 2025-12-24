using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;
public class TaskLocation
{
    public string LocationName { get; private set; } = "";
    public string? LocationCoords { get; private set; }

    public TaskLocation(string? locationName, string? locationCoords)
    {
        LocationName = locationName ?? "";
        LocationCoords = locationCoords;
    }

    public void ChangeName(string name)
        => LocationName = ValidationHelper.ValidateStringField(name, 1, 100, nameof(name), "Location name");
    public void ChangeCoords(string coords)
        => LocationCoords = ValidationHelper.ValidateStringField(coords, 1, 100, nameof(coords), "Location coordinates");

}
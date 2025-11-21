
using System.Numerics;
using System.Text.RegularExpressions;

namespace Task_Manager_Back.Domain.Common;
public static partial class ValidationHelper
{
    [GeneratedRegex(@"^#[0-9A-Fa-f]{6}$")]
    private static partial Regex HexColorRegex();

    public static string ValidateHexColor(string color, string paramName)
    {
        if (string.IsNullOrWhiteSpace(color) || !HexColorRegex().IsMatch(color))
            throw new ArgumentException("Color must be a valid hex code (#RRGGBB)", paramName);
        return color;
    }
    public static string ValidateStringField(
        string value,
        int minLength,
        int maxLength,
        string paramName, // actual name of the parameter, how it is in code
        string? fieldName = null // user-friendly name for error messages
    )
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length < minLength || value.Length > maxLength)
            throw new ArgumentException(
                $"{fieldName ?? paramName} must be between {minLength} and {maxLength} characters",
                paramName);

        return value;
    }

    public static Guid ValidateGuid(Guid id, string paramName)
    {
        if (id == Guid.Empty)
            throw new ArgumentException($"{paramName} required", paramName);
        return id;
    }

    public static T ValidateNonNegative<T>(T value, string paramName)
        where T : INumber<T>
    {
        if (value < T.Zero)
            throw new ArgumentException($"{paramName} cannot be negative", paramName);
        return value;
    }

    public static DateTime ValidateNotPast(DateTime date, string paramName)
    {
        if (date < DateTime.UtcNow)
            throw new ArgumentException($"{paramName} cannot be in the past", paramName);
        return date;
    }
}

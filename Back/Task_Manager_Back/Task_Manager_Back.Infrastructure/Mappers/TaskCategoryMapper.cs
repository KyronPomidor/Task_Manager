using System;
using Task_Manager_Back.Domain.Entities.TaskEntity;
using Task_Manager_Back.Infrastructure.DatabaseEntities;

namespace Task_Manager_Back.Infrastructure.Mappers;

public static class TaskCategoryMapper
{
    public static DatabaseCustomCategory ToDbEntity(this CustomCategory category)
    {
        if (category == null) throw new ArgumentNullException(nameof(category));

        return new DatabaseCustomCategory
        {
            Id = category.Id,
            UserId = category.UserId,
            Title = category.Title,
            Description = category.Description,
            Order = category.Order,
            ParentCategoryId = category.ParentCategoryId,
            // SubCategories можно не заполнять сразу, добавим через EF
        };
    }

    public static CustomCategory ToDomain(this DatabaseCustomCategory dbCategory)
    {
        if (dbCategory == null) throw new ArgumentNullException(nameof(dbCategory));

        return CustomCategory.LoadFromPersistence(
            id: dbCategory.Id,
            userId: dbCategory.UserId,
            title: dbCategory.Title,
            description: dbCategory.Description,
            order: dbCategory.Order,
            parentCategoryId: dbCategory.ParentCategoryId
        );

    }
}

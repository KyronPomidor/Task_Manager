using System;
using Microsoft.Extensions.Logging;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;
using Task_Manager_Back.Infrastructure.DbContext;

namespace Task_Manager_Back.Infrastructure.Repositories;

public class RelationTypeRepository : IRelationTypeRepository
{
    private readonly AppDbContext _context;
    private readonly ILogger<TaskRepository> _logger;

    public RelationTypeRepository(AppDbContext context, ILogger<TaskRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public void Add(TaskRelation taskCustomRelation)
    {
        throw new NotImplementedException();
    }

    public Task<TaskEntity?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}

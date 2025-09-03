using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.IRepositories;
public interface IStatusRepository
{
    Status GetById(Guid id);
    List<Status> GetByUser(Guid userId);
    void Add(Status status);
    void Update(Status status);
    void Delete(Status status);
}

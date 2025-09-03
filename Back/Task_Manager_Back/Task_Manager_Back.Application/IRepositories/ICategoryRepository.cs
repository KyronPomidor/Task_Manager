using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.IRepositories;
public interface ICategoryRepository
{
    Category GetById(Guid id);
    List<Category> GetByUser(Guid userId);
    void Add(Category category);
    void Update(Category category);
    void Delete(Category category);
}

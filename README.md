# Task & Expense Management System

## Description
A productivity system that combines **GTD-style task management**.  
Users can organize their tasks into categories, visualize dependencies between tasks/projects, and at the same time keep track of personal or project-related expenses with budget control.  
The system also provides interactive graph visualization to better understand relationships between tasks, expenses, and projects.

---

## Features

### Task Management
- Organize tasks into categories (Inbox, Next Actions, Projects, Someday)
- Task status tracking (open, in progress, completed, failed)
- Attachments, reminders, and relations between tasks
- Graph view of tasks and dependencies

### Expense Management
- Record transactions with amount, category, location
- Categorize expenses (e.g., Food, Travel, Utilities)
- Set and monitor budgets per category
- Analytics of expenses per category and per period

### Visualization
- Interactive graph view of tasks, shopping items, and transactions
- Filtering options (show/hide tasks, expenses, links, categories)
- Relationship visualization between tasks and financial operations

---

## Use Cases

1. **Task Planning (Student / Professional)**
   - Add a project → break it down into tasks
   - Link tasks together (dependencies)
   - Get reminders before deadlines
   - Track completion status on the graph

2. **Expense Tracking (Individual / Team)**
   - Add a new transaction (e.g., bought software license)
   - Assign it to a project or category
   - Check if total expenses are still within the budget

3. **Combined Workflow (Project Manager)**
   - Create a project with multiple tasks
   - Assign each task budget-linked shopping items or expenses
   - Use graph visualization to see project progress and financial health together

---

## Tech Stack
- **Frontend:** React
- **Backend:** .NET / ASP.NET Core
- **Database:** SQL-based (PostgreSQL / MS SQL)
- **Visualization:** D3.js or Cytoscape.js
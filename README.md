# GTD Graph Task & Budget Manager

## 📌 Description

A productivity system that combines **GTD-style task management** with **Zettelkasten-inspired graph visualization** and a built-in **budget manager**.  
Users can structure tasks into categories, visualize and edit dependencies in an interactive graph, and track expenses directly inside the same workflow.

---

## ✨ Features

### 📝 Task Management

-   Organize tasks into categories with hierarchical nesting (including a special **Inbox**).
    
-   Create dependencies between tasks:
    
    -   via **drag-and-drop in list view** (using the star handle), or
        
    -   directly inside the **graph view** by connecting two nodes.
        
-   Configurable **dependency arrow direction** (task → dependency or dependency → task).
    
-   Switch seamlessly between **list view** and **interactive graph view**.
    
-   Add shopping lists inside tasks with the **$ button**.
    
-   Filter and sort tasks by category or dependency.
    

### 🌐 Graph Visualization

-   Interactive graph view of tasks, categories, and dependencies.
    
-   Customize display options (categories, dependency arrows, cross-category links).
    
-   Node positions are persistent across sessions and devices.
    
-   Unified visualization: tasks, expenses, categories, and transactions can all appear in the graph.
    

### 💰 Budget Management

-   Switch to **Budget Manager** mode with one click.
    
-   Collect purchases into a shopping list across categories.
    
-   Manage **Cart** (pending items) and **Transactions** (completed purchases).
    
-   Assign prices and locations to purchases.
    
-   Track spending history and view detailed analytics by time period and category.
    
-   Graph mode also supports **purchases, transactions, and categories** as nodes.
    

---

## 🔎 Use Cases

1.  **Personal Task Planning**
    
    -   Create a project and break it into tasks.
        
    -   Link tasks together in the graph to define dependencies.
        
    -   Organize tasks into nested categories.
        
2.  **Expense Tracking**
    
    -   Add purchases and attach them to tasks or categories.
        
    -   Move items from **Cart → Transactions**.
        
    -   Track money spent per category and per time period.
        
3.  **Combined Productivity & Finance**
    
    -   Manage both tasks and expenses in one workflow.
        
    -   Use graphs to visualize project structure and financial flows together.
        
    -   Explore relationships between tasks, dependencies, and related purchases.
        

---

## 🖼 Example Graph View

![Graph View Example](https://www.researchgate.net/profile/Alena-Otto/publication/254426268/figure/fig1/AS:341749919698955@1458490939270/Example-of-a-precedence-graph.png)

-   **Blue arrows** = task dependencies
    
-   **Nodes with 🛒** = purchases linked to tasks
    

---

## 🛠 Tech Stack

-   **Frontend:** React
    
-   **Backend:** .NET 9 with Clean Architecture (Domain, Application, Repository, API)
    
-   **Database:** SQLite
    
-   **Visualization:** Customizable interactive graph rendering
    

---

## 📜 License

This project is released with no **License**.

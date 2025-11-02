# Changelog

## 02-11-2025
- **Snake Game enhancements**: Implemented a fully functional Snake Game component. Resolved direction change issue where rapid key presses (e.g., right to down to left in quick succession) caused improper movement or self-collision, by introducing a direction queue system to process inputs sequentially per frame. Contributors: Mihail. P

## 01-11-2025
- **User-specific data retrieval support**: Updated controllers to handle requests by user ID, replacing `GetAll` methods with `GetAllByUserId`. Introduced `GetTasksByUserIdRequest` and updated related use cases and request classes. Added `TaskQueryExtensions` for query optimization and `EnsureCategoryAsync` in `AppDbSeeder` to prevent duplicate categories. Integrated a basic raw email sending feature relying on a local SMTP server (`mailpit.exe`). Contributors: Andrei.E

## 31-10-2025
- **Code modularization**: `Tasks.js` was divided into multiple focused components (`SortableTask.js`, `taskActions.js`, `taskCard.js`, etc.) to improve maintainability. Contributors: Kirill, Andrei.U
- **Color management enhancements**: Adjusted and standardized color handling in`colorUtils.js`. Contributors: Kirill
- **Backend optimization - frontend**: Streamlined communication between frontend and backend layers. Contributors: Kirill
- **UI improvements**: Refined layout, visual hierarchy, and overall user experience for better accessibility. Contributors: Kirill, Andrei.U 

## 30-10-2025
- **API abstraction**: Extracted and centralized all API-related logic into `taskService.js`, making the functions reusable. Contributors: Kirill

## 29-10-2025
- **Project structure update**: Reorganized key files (`Tasks.js`, `TaskGraphIntegration.js`) to improve code clarity. Contributors: Kirill, Andrey.U

## 28-10-2025
- **Custom hook refactoring**: Completed major refactoring for `useDragDrop.js` and `useTasks.js` enhance logic reusability and code readability. Contributors: Kirill, Andrei.U
- **Frontend restructuring**: Updated the general file organization, including adjustments in `App.js`. Contributors: Kirill

## 27-10-2025
- **Category management refactor**: Extracted category-related logic into a dedicated hook (`useCategories.js`), simplifying state handling and improving modularity. Contributors: Kirill

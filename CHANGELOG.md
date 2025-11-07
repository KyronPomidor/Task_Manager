# Changelog

## 02-11-2025
- **Snake Game enhancements**: Implemented a fully functional Snake Game component. Resolved direction change issue where rapid key presses (e.g., right to down to left in quick succession) caused improper movement or self-collision, by introducing a direction queue system to process inputs sequentially per frame. Contributors: [Mihail. P](https://github.com/varsarius)

## 01-11-2025
- **User-specific data retrieval support**: Updated controllers to handle requests by user ID, replacing `GetAll` methods with `GetAllByUserId`. Introduced `GetTasksByUserIdRequest` and updated related use cases and request classes. Added `TaskQueryExtensions` for query optimization and `EnsureCategoryAsync` in `AppDbSeeder` to prevent duplicate categories. Integrated a basic raw email sending feature relying on a local SMTP server (`mailpit.exe`). Contributors: [Andrei.E](https://github.com/EXakiToR)
- **Budget Tracking**: Implementation of the budget tracking system, refactoring the main concept and the idea. Beginning on working on the new feature of integrated map: attaching a special address to a certain task and a separate tab with the map. Contributors: [Rustem](https://github.com/fxmidaaa)

## 31-10-2025
- **Code modularization**: `Tasks.js` was divided into multiple focused components (`SortableTask.js`, `taskActions.js`, `taskCard.js`, etc.) to improve maintainability. Contributors: [Kirill](https://github.com/KyronPomidor), [Andrei.U](https://github.com/PrikolistTheSillyThing), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/af534178e32ab7df1cd0b8faeb2720fca5d40eb8))
- **Color management enhancements**: Adjusted and standardized color handling in`colorUtils.js`. Contributors: [Kirill](https://github.com/KyronPomidor), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/9eaa84b060ddfc3c791a93eca4b1ffbcfbee0355))
- **Backend optimization - frontend**: Streamlined communication between frontend and backend layers. Contributors: [Kirill](https://github.com/KyronPomidor), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/43672a1c7bf9380825f115b08bea1c25feb7cdfc))
- **UI improvements**: Refined layout, visual hierarchy, and overall user experience for better accessibility. Contributors: [Kirill](https://github.com/KyronPomidor), [Andrei.U](https://github.com/PrikolistTheSillyThing), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/43672a1c7bf9380825f115b08bea1c25feb7cdfc))

## 30-10-2025
- **API abstraction**: Extracted and centralized all API-related logic into `taskService.js`, making the functions reusable. Contributors: [Kirill](https://github.com/KyronPomidor), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/43672a1c7bf9380825f115b08bea1c25feb7cdfc))

## 29-10-2025
- **Project structure update**: Reorganized key files (`Tasks.js`, `TaskGraphIntegration.js`) to improve code clarity. Contributors: [Kirill](https://github.com/KyronPomidor), [Andrei.U](https://github.com/PrikolistTheSillyThing), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/43672a1c7bf9380825f115b08bea1c25feb7cdfc))

## 28-10-2025
- **Custom hook refactoring**: Completed major refactoring for `useDragDrop.js` and `useTasks.js` enhance logic reusability and code readability. Contributors: [Kirill](https://github.com/KyronPomidor), [Andrei.U](https://github.com/PrikolistTheSillyThing), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/43672a1c7bf9380825f115b08bea1c25feb7cdfc))
- **Frontend restructuring**: Updated the general file organization, including adjustments in `App.js`. Contributors: [Kirill](https://github.com/KyronPomidor), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/43672a1c7bf9380825f115b08bea1c25feb7cdfc))

## 27-10-2025
- **Category management refactor**: Extracted category-related logic into a dedicated hook (`useCategories.js`), simplifying state handling and improving modularity. Contributors: [Kirill](https://github.com/KyronPomidor), ([Commit](https://github.com/KyronPomidor/Task_Manager/commit/43672a1c7bf9380825f115b08bea1c25feb7cdfc))

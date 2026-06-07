## 📝 Todo App with Local Storage

A modern, feature-rich todo list application built with Next.js, React, and Zustand. All data is persisted in browser local storage.

### ✨ Features

- ✅ **Create, Read, Update, Delete (CRUD)** todos
- 💾 **Local Storage Persistence** - All data saved in browser
- 🎯 **Priority Levels** - High, Medium, Low
- 📅 **Due Dates** - Set deadlines for tasks
- 🔍 **Filter by Status** - All, Active, Completed
- 📊 **Sort Options** - By Date, Priority, or Title
- 📝 **Descriptions** - Add detailed notes to todos
- 🧹 **Clear Completed** - Bulk remove finished tasks
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Built with Tailwind CSS

### 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **State Management:** Zustand with localStorage middleware
- **Styling:** Tailwind CSS
- **Storage:** Browser Local Storage API

### 🚀 Quick Start

```bash
# Navigate to the app directory
cd apps/todo-app

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### 📂 Project Structure

```
apps/todo-app/
├── src/
│   ├── components/
│   │   ├── TodoForm.tsx       # Form for adding new todos
│   │   ├── TodoItem.tsx       # Individual todo display
│   │   └── TodoFilters.tsx    # Filter and sort controls
│   ├── pages/
│   │   ├── _app.tsx           # App wrapper
│   │   └── index.tsx          # Main page
│   ├── store/
│   │   └── todoStore.ts       # Zustand store with localStorage
│   └── styles/
│       └── globals.css        # Global styles
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

### 💾 Data Persistence

The app automatically saves all todos to browser local storage under the key `todo-store`. The data structure includes:

```typescript
interface Todo {
  id: string;                           // Unique identifier
  title: string;                        // Task title
  description?: string;                 // Task description
  completed: boolean;                   // Completion status
  priority: 'low' | 'medium' | 'high'; // Priority level
  dueDate?: string;                     // ISO date string
  createdAt: string;                    // ISO timestamp
  updatedAt: string;                    // ISO timestamp
}
```

### 🧠 Store Structure (Zustand)

The `useTodoStore` provides:

**State:**
- `todos[]` - Array of todo items
- `filter` - Current filter (all/active/completed)
- `sortBy` - Current sort option (date/priority/title)

**Actions:**
- `addTodo()` - Create new todo
- `updateTodo()` - Edit existing todo
- `deleteTodo()` - Remove todo
- `toggleTodo()` - Toggle completion status
- `setFilter()` - Change filter
- `setSortBy()` - Change sort order
- `clearCompleted()` - Remove all completed todos
- `getFilteredTodos()` - Get filtered and sorted todos

### 🎨 Component Overview

#### TodoForm
Creates and submits new todos with:
- Title (required)
- Description
- Priority level
- Due date

#### TodoItem
Displays individual todo with:
- Checkbox to toggle completion
- Title and description
- Priority badge
- Due date
- Creation date
- Edit and Delete buttons
- Inline editing mode

#### TodoFilters
Shows:
- Statistics (Total, Active, Completed)
- Filter buttons
- Sort dropdown
- Clear completed button

### 🔧 Customization

#### Change Local Storage Key
Edit `apps/todo-app/src/store/todoStore.ts`:
```typescript
{
  name: 'your-custom-key', // Change this
  storage: createJSONStorage(() => localStorage),
}
```

#### Modify Priority Colors
Edit `apps/todo-app/src/components/TodoItem.tsx`:
```typescript
const priorityColors = {
  high: 'your-color-class',
  medium: 'your-color-class',
  low: 'your-color-class',
};
```

### 📦 Build for Production

```bash
npm run build
npm start
```

### 🧪 Testing

Add tests with Jest:
```bash
npm run test
```

### 📝 Notes

- **Browser Storage Limit:** Most browsers allow 5-10MB per origin
- **No Server Required:** This is a completely client-side application
- **Data Portability:** Export todos via browser DevTools → Application → Local Storage
- **Privacy:** All data remains on the user's device

### 🎯 Future Enhancements

- [ ] Export/Import todos as JSON or CSV
- [ ] Dark mode support
- [ ] Tags and categories
- [ ] Recurring todos
- [ ] Notifications/Reminders
- [ ] Search functionality
- [ ] Drag-and-drop reordering
- [ ] Cloud sync option
- [ ] Mobile app version

### 📄 License

MIT License - See LICENSE file in root

---

**Built with ❤️ for assistant.bd**

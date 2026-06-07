'use client';

import { useTodoStore } from '@/stores/todoStore';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const getFilteredTodos = useTodoStore((state) => state.getFilteredTodos);
  const todos = getFilteredTodos();

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  if (totalCount === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-lg">No tasks yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{completedCount}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> tasks completed
          {totalCount > 0 && (
            <span className="ml-2 text-blue-600">
              ({Math.round((completedCount / totalCount) * 100)}%)
            </span>
          )}
        </p>
        <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Todo Items */}
      <div>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

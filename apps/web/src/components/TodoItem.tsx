'use client';

import { Todo, useTodoStore } from '@/stores/todoStore';
import { useState } from 'react';

interface TodoItemProps {
  todo: Todo;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const handleSave = () => {
    if (editedTitle.trim()) {
      updateTodo(todo.id, {
        title: editedTitle,
        description: editedDescription || undefined,
      });
      setIsEditing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 mb-3 border-l-4 transition-all ${
        todo.completed
          ? 'border-l-gray-400 opacity-75'
          : todo.priority === 'high'
          ? 'border-l-red-500'
          : todo.priority === 'medium'
          ? 'border-l-yellow-500'
          : 'border-l-green-500'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="mt-1 w-5 h-5 rounded border-gray-300 cursor-pointer"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={2}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <>
              <h3
                className={`font-semibold text-lg break-words ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`text-sm mt-1 break-words ${
                  todo.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
            </>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {todo.category}
            </span>

            <span className={`text-xs px-2 py-1 rounded ${priorityColors[todo.priority]}`}>
              {priorityLabels[todo.priority]}
            </span>

            {todo.dueDate && (
              <span className={`text-xs px-2 py-1 rounded ${
                isOverdue
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {isOverdue ? '⚠️ ' : '📅 '}{formatDate(todo.dueDate)}
              </span>
            )}

            {todo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(todo.title);
                  setEditedDescription(todo.description || '');
                }}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

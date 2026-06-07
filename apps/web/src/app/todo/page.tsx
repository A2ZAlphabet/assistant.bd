'use client';

import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { FilterBar } from '@/components/FilterBar';

export default function TodoPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 My Tasks</h1>
          <p className="text-gray-600">
            Organize your tasks with categories, priorities, due dates, and tags
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Add Todo Form */}
          <TodoForm />

          {/* Filters */}
          <FilterBar />

          {/* Todo List */}
          <TodoList />
        </div>
      </div>
    </div>
  );
}

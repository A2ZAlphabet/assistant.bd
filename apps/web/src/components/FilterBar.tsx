'use client';

import { useTodoStore } from '@/stores/todoStore';

export function FilterBar() {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);
  const clearFilters = useTodoStore((state) => state.clearFilters);
  const getCategories = useTodoStore((state) => state.getCategories);
  const getTags = useTodoStore((state) => state.getTags);

  const categories = getCategories();
  const tags = getTags();
  const hasActiveFilters = 
    filter.category || 
    filter.priority || 
    filter.completed !== null || 
    filter.searchQuery;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            placeholder="Search tasks, descriptions, tags..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filter.category || ''}
              onChange={(e) =>
                setFilter({ category: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filter.priority || ''}
              onChange={(e) =>
                setFilter({ priority: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filter.completed === null ? '' : filter.completed ? 'completed' : 'pending'}
              onChange={(e) => {
                if (e.target.value === '') {
                  setFilter({ completed: null });
                } else {
                  setFilter({ completed: e.target.value === 'completed' });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`w-full px-3 py-2 rounded-md font-medium transition-colors ${
                hasActiveFilters
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Tags Display */}
        {tags.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Available Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter({ searchQuery: `#${tag}` })}
                  className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-1 rounded transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface TodoStore {
  todos: Todo[];
  filter: {
    category: string | null;
    priority: string | null;
    completed: boolean | null;
    searchQuery: string;
  };
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setFilter: (filter: Partial<TodoStore['filter']>) => void;
  clearFilters: () => void;
  getFilteredTodos: () => Todo[];
  getCategories: () => string[];
  getTags: () => string[];
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: {
        category: null,
        priority: null,
        completed: null,
        searchQuery: '',
      },

      addTodo: (todo) => {
        const id = `todo-${Date.now()}-${Math.random()}`;
        const now = new Date().toISOString();
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...todo,
              id,
              createdAt: now,
              updatedAt: now,
            },
          ],
        }));
      },

      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          ),
        }));
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          ),
        }));
      },

      setFilter: (filter) => {
        set((state) => ({
          filter: {
            ...state.filter,
            ...filter,
          },
        }));
      },

      clearFilters: () => {
        set({
          filter: {
            category: null,
            priority: null,
            completed: null,
            searchQuery: '',
          },
        });
      },

      getFilteredTodos: () => {
        const state = get();
        return state.todos.filter((todo) => {
          if (state.filter.category && todo.category !== state.filter.category) {
            return false;
          }
          if (state.filter.priority && todo.priority !== state.filter.priority) {
            return false;
          }
          if (
            state.filter.completed !== null &&
            todo.completed !== state.filter.completed
          ) {
            return false;
          }
          if (state.filter.searchQuery) {
            const query = state.filter.searchQuery.toLowerCase();
            return (
              todo.title.toLowerCase().includes(query) ||
              todo.description?.toLowerCase().includes(query) ||
              todo.tags.some((tag) => tag.toLowerCase().includes(query))
            );
          }
          return true;
        });
      },

      getCategories: () => {
        const state = get();
        return Array.from(new Set(state.todos.map((todo) => todo.category)));
      },

      getTags: () => {
        const state = get();
        return Array.from(new Set(state.todos.flatMap((todo) => todo.tags)));
      },
    }),
    {
      name: 'todo-store',
      version: 1,
    }
  )
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupMockApi } from './mocks/api'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Check environment variable or missing api
if (import.meta.env.VITE_USE_MOCK === 'true' || !window.api) {
  setupMockApi();
}

// Initialize theme before render to prevent flash
const initializeTheme = async () => {
  try {
    const settings = await window.api?.settings?.getAll?.();
    const theme = settings?.theme || 'system';
    const isDark = theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  } catch {
    // Default to dark theme on error
    document.documentElement.classList.add('dark');
  }
};

initializeTheme();

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

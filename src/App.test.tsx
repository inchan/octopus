/**
 * @vitest-environment happy-dom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';
import { vi, describe, it, expect, beforeAll } from 'vitest';
import { setupMockApi } from './mocks/api';

// Mock child components to isolate App logic
vi.mock('@/features/tools/ToolsPage', () => ({ ToolsPage: () => <div data-testid="tools-page">Tools Page</div> }));
vi.mock('@/features/sync/SyncPage', () => ({ SyncPage: () => <div data-testid="sync-page">Sync Page</div> }));
vi.mock('@/features/projects/ProjectsPage', () => ({ ProjectsPage: () => <div data-testid="projects-page">Projects Page</div> }));

// Setup mock API for tests
beforeAll(() => {
    setupMockApi();
});

describe('App Navigation', () => {
    it('renders Tools page by default', () => {
        render(<App />);
        expect(screen.getByTestId('tools-page')).toBeDefined();
    });

    it('navigates to Projects page when clicked in Sidebar', () => {
        render(<App />);

        // Find "Projects" button in Sidebar
        const projectsBtn = screen.getByText('Projects');
        fireEvent.click(projectsBtn);

        // Check if ProjectsPage rendered
        expect(screen.getByTestId('projects-page')).toBeDefined();
        // Check if ToolsPage is gone (assuming conditional rendering)
        expect(screen.queryByTestId('tools-page')).toBeNull();
    });
});

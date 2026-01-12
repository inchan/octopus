/**
 * @vitest-environment happy-dom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';
import { vi, describe, it, expect } from 'vitest';
// import React from 'react'; // Removed unused import

// Mock child components to isolate App logic
vi.mock('@/features/tools/ToolsPage', () => ({ ToolsPage: () => <div data-testid="tools-page">Tools Page</div> }));
vi.mock('@/features/sync/SyncPage', () => ({ SyncPage: () => <div data-testid="sync-page">Sync Page</div> }));
vi.mock('@/features/projects/ProjectsPage', () => ({ ProjectsPage: () => <div data-testid="projects-page">Projects Page</div> }));

// Mock Sidebar if necessary, or let it render (it's part of AppShell)
// Since AppShell imports Sidebar, and we want to test navigation which happens via Sidebar, 
// we should probably let Sidebar render or mock it if it's too complex.
// Let's assume standard render is fine for integration test.

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

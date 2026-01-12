import { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppShell } from '@/components/layout/AppShell';
import { ToolsPage } from '@/features/tools/ToolsPage';
import { SyncPage } from '@/features/sync/SyncPage';
import { ProjectsPage } from '@/features/projects/ProjectsPage';
import { RulesPage } from '@/features/rules/RulesPage';
import { McpPage } from '@/features/mcp/McpPage';
import { HistoryPage } from '@/features/history/HistoryPage';
import { SettingsPage } from '@/features/settings/SettingsPage';

type Page = 'tools' | 'sync' | 'projects' | 'rules' | 'mcp' | 'history' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('tools');

  return (
    <AppShell
      activePage={currentPage}
      onNavigate={(p) => setCurrentPage(p as Page)}
      layoutMode={['rules', 'mcp', 'projects'].includes(currentPage) ? 'fullscreen' : 'default'}
    >
      <ErrorBoundary>
        {currentPage === 'tools' && <ToolsPage />}
        {currentPage === 'sync' && <SyncPage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'rules' && <RulesPage />}
        {currentPage === 'mcp' && <McpPage />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </ErrorBoundary>
    </AppShell>
  );
}

export default App;

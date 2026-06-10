import TopBar from './TopBar';
import Footer from './Footer';

/**
 * DashboardLayout — Clean full-width layout: top bar + main + right panel.
 * No sidebar — clean, spacious design.
 */
export default function DashboardLayout({
  onSearch,
  isLoading,
  mainContent,
  rightPanel,
}) {
  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <TopBar onSearch={onSearch} isLoading={isLoading} />

      {/* Content area — center + right panel */}
      <div className="dashboard-content">
        {/* Center content — scrollable */}
        <main className="dashboard-main flex flex-col justify-between">
          <div className="flex-1">
            {mainContent}
          </div>
          <Footer />
        </main>

        {/* Right sidebar panel — hidden on small screens */}
        {rightPanel && (
          <aside className="dashboard-right-panel">
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  );
}

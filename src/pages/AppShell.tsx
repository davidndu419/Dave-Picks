import { Outlet } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation';

export function AppShell() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg">
      <main className="flex-1 pb-[80px]">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}

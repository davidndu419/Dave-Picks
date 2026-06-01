import { useLocation, Link } from 'react-router-dom';

interface NavTab {
  name: string;
  path: string;
  icon: string;
}

const tabs: NavTab[] = [
  { name: 'Today', path: '/app/today', icon: '📅' },
  { name: 'My Slips', path: '/app/slips', icon: '📋' },
  { name: 'Analytics', path: '/app/analytics', icon: '📊' },
  { name: 'Calendar', path: '/app/calendar', icon: '🗓️' },
  { name: 'Settings', path: '/app/settings', icon: '⚙️' },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-border">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 ${
                isActive
                  ? 'text-accent-green border-t-2 border-accent-green'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

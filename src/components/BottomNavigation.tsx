import { h } from 'preact';

// SVG Icon Components - Styled to match iOS screenshot
// Stroke color will be controlled by text color (activeTabIcon or inactiveTabIcon)

const HomeIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-0.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const SurahsIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-0.5">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const ReaderIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-0.5">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const BookmarksIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-0.5">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SettingsIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-0.5">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

interface NavItemProps {
  label: string;
  icon: h.JSX.Element; // Accept JSX element for icon
  isActive?: boolean;
  href: string; // Add href for navigation
}

const NavItem = ({ label, icon, isActive, href }: NavItemProps) => {
  return (
    <a href={href} class="flex flex-col items-center justify-center flex-1 p-2 cursor-pointer group">
      <div class={`mb-0.5 ${isActive ? 'text-activeTabIcon' : 'text-inactiveTabIcon group-hover:text-activeTabIcon/70 transition-colors'}`}>
        {icon}
      </div>
      <span
        class={`text-xs font-englishMedium ${
          isActive ? 'text-activeTabIcon' : 'text-inactiveTabIcon group-hover:text-activeTabIcon/70 transition-colors'
        }`}
      >
        {label}
      </span>
    </a>
  );
};

interface BottomNavigationProps {
  activeTab?: string;
  hidden?: boolean; // Nueva prop para controlar visibilidad
}

const BottomNavigation = ({ activeTab, hidden = false }: BottomNavigationProps) => {
  // Si está oculto, no renderizar nada
  if (hidden) return null;

  // Determine active tab from props or URL
  // If activeTab is provided, use it; otherwise use the URL path
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const determineActive = (tabName: string) => {
    if (activeTab) {
      return activeTab === tabName;
    }
    // Fallback to path-based detection
    const paths = {
      home: '/',
      surahs: '/surahs',
      reader: '/reader',
      bookmarks: '/bookmarks',
      settings: '/settings'
    };
    return currentPath === paths[tabName as keyof typeof paths] ||
      (paths[tabName as keyof typeof paths] === '/' && currentPath.startsWith('/index'));
  };

  const tabs = [
    { label: 'Home', icon: <HomeIcon />, href: '/', name: 'home' },
    { label: 'Surahs', icon: <SurahsIcon />, href: '/surahs', name: 'surahs' },
    { label: 'Reader', icon: <ReaderIcon />, href: '/reader', name: 'reader' },
    { label: 'Bookmarks', icon: <BookmarksIcon />, href: '/bookmarks', name: 'bookmarks' },
    { label: 'Settings', icon: <SettingsIcon />, href: '/settings', name: 'settings' },
  ];

  return (
    // Adjusted styling to match screenshot: slightly less height, more padding for touch targets
    <nav class="w-full h-[60px] bg-transparent flex items-stretch fixed bottom-0 left-0 right-0 z-50">
      {tabs.map((tab) => (
        <NavItem
          key={tab.name}
          label={tab.label}
          icon={tab.icon} // Pass the icon component directly
          isActive={determineActive(tab.name)} // Use the new active state detection function
          href={tab.href}
        />
      ))}
    </nav>
  );
};

export default BottomNavigation;

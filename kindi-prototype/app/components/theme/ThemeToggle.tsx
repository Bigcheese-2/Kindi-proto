"use client";

import { useTheme } from '@/app/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setThemeMode } = useTheme();
  
  return (
    <div className="theme-toggle flex items-center space-x-2">
      <label htmlFor="theme-select" className="text-sm text-neutral-light">Theme</label>
      <select
        id="theme-select"
        value={theme.mode}
        onChange={(e) => setThemeMode(e.target.value as any)}
        aria-label="Select theme mode"
        className="bg-secondary text-neutral-light rounded px-2 py-1 text-sm border border-transparent focus:border-accent focus:outline-none"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};

export default ThemeToggle;

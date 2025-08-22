"use client";

import MainLayout from './components/layout/MainLayout';
import KeyboardShortcutsSetup from './components/keyboard/KeyboardShortcutsSetup';

export default function Home() {
  return (
    <MainLayout>
      <KeyboardShortcutsSetup />
      {/* Content will be rendered through the MainLayout component */}
    </MainLayout>
  );
}
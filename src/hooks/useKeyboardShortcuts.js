import { useEffect } from 'react';

export default function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      for (const shortcut of shortcuts) {
        const modMatch = (shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true);
        if (modMatch && e.key === shortcut.key) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}

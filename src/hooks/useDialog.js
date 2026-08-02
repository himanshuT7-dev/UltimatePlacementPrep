import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Small reusable hook for accessible modals.
 * Adds role="dialog" / aria-modal semantics, traps Tab focus,
 * closes on Escape, focuses the first focusable element on open,
 * and restores focus on close.
 */
export default function useDialog({ onClose }) {
  const dialogRef = useRef(null);
  const openRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest onClose without re-running the setup effect, so parent
  // re-renders (e.g. an inline arrow prop) don't re-grab focus.
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    openRef.current = previouslyFocused;

    const getFocusable = () =>
      dialog ? Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)) : [];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialog.contains(active)) {
        // Focus is outside the dialog (e.g. lazy-loaded content); pull it in.
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the first focusable element inside the dialog.
    const focusable = getFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      dialog?.focus?.();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the element that had it before the dialog opened.
      previouslyFocused?.focus?.();
    };
  }, []);

  const dialogProps = {
    role: 'dialog',
    'aria-modal': true,
    ref: dialogRef,
  };

  return { dialogRef, openRef, dialogProps };
}

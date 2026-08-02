/**
 * Track SVG Icons — replaces emoji icons throughout the app.
 * Each returns a styled inline SVG, sized via `size` prop.
 */
import React from 'react';

/* ── Java Icon (steaming cup + bytecode λ) ── */
export const JavaIcon = React.memo(function JavaIcon({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} role="img" aria-label="Java">
      <path d="M9 3C9 3 7.5 5.5 8.5 7.5C9.5 9.5 11 9 11 9C11 9 9.5 11.5 7 11C4.5 10.5 5 8 5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.5 2C12.5 2 14 5 12.5 7.5C11 10 13 10.5 13 10.5C13 10.5 11 13 8.5 12C6 11 7 8.5 7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 14C6 14 4 15 5.5 16.5C7 18 10 17.5 12 17.5C14 17.5 17 18 18.5 16.5C20 15 18 14 18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 17.5C7 17.5 6.5 20 9 21C11.5 22 14.5 21 16 21C17.5 21 19 20 18.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15.5 8.5L16.5 9.5L18.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
});

/* ── SQL / Database Icon ── */
export const SQLIcon = React.memo(function SQLIcon({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} role="img" aria-label="SQL">
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 6V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 12V18C4 19.66 7.58 21 12 21C16.42 21 20 19.66 20 18V12" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 9L11 11L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
});

/* ── JavaScript Icon (JS badge style) ── */
export const JSIcon = React.memo(function JSIcon({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} role="img" aria-label="JavaScript">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 8V14C10 15.1 9.1 16 8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 8V13C14 14.66 15.34 16 17 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 12C14 12 15 11 17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
});

/* ── React Icon (atom/orbit) ── */
export const ReactIcon = React.memo(function ReactIcon({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} role="img" aria-label="React">
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)"/>
    </svg>
  );
});

/* ── Communication / Speech Icon ── */
export const CommIcon = React.memo(function CommIcon({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} role="img" aria-label="Communication">
      <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C10.5 21 9.09 20.62 7.85 19.96L3 21L4.04 16.15C3.38 14.91 3 13.5 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
});

/* ── UPP Logo SVG (inline, no image dep) ── */
export const UPPLogo = React.memo(function UPPLogo({ size = 32, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} role="img" aria-label="Ultimate Placement Prep">
      {/* Outer ring */}
      <circle cx="32" cy="32" r="30" stroke="url(#uppGold)" strokeWidth="2.5" fill="none" opacity="0.9"/>
      {/* Violet glow backing */}
      <circle cx="32" cy="32" r="26" fill="url(#uppBg)" opacity="0.85"/>
      {/* Up arrow */}
      <path d="M32 14L38 24H34V40H30V24H26L32 14Z" fill="url(#uppGold)"/>
      {/* Code brackets */}
      <path d="M16 28L10 32L16 36" stroke="url(#uppGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M48 28L54 32L48 36" stroke="url(#uppGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Star accent */}
      <circle cx="32" cy="48" r="2.5" fill="#f59e0b" opacity="0.8"/>
      <defs>
        <linearGradient id="uppGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--amber)"/>
          <stop offset="100%" stopColor="#f59e0b"/>
        </linearGradient>
        <radialGradient id="uppBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#090d18" stopOpacity="0.9"/>
        </radialGradient>
      </defs>
    </svg>
  );
});

/* ── Icon lookup by track ID ── */
export const TRACK_ICON_MAP = {
  java:          JavaIcon,
  javascript:    JSIcon,
  react:         ReactIcon,
  sql:           SQLIcon,
  communication: CommIcon,
};

export const TrackIcon = React.memo(function TrackIcon({ trackId, size = 18, style = {} }) {
  const Icon = TRACK_ICON_MAP[trackId];
  if (!Icon) return null;
  return <Icon size={size} style={style} />;
});

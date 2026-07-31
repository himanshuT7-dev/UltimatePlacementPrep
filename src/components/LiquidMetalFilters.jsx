import React from 'react';

/**
 * LiquidMetalFilters — Inject SVG Filters for organic ferrofluid,
 * liquid mercury displacement, and specular chrome lighting reflections.
 */
export default function LiquidMetalFilters() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
      <defs>
        {/* Organic Liquid Mercury Displacement Filter */}
        <filter id="liquidMercury" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feSpecularLighting in="displaced" surfaceScale="3" specularConstant="1.2" specularExponent="30" lightingColor="#ffffff" result="specular">
            <feDistantLight azimuth="225" elevation="45" />
          </feSpecularLighting>
          <feComposite in="specular" in2="displaced" operator="in" result="specularCut" />
          <feBlend in="displaced" in2="specularCut" mode="screen" />
        </filter>

        {/* Ferrofluid Magnet Pulse Filter */}
        <filter id="ferrofluidGoo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 19 -9
          " result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>

        {/* Holographic Laser Scanner Sheen */}
        <linearGradient id="laserBeamGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
          <stop offset="50%" stopColor="rgba(56, 189, 248, 0.8)" />
          <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

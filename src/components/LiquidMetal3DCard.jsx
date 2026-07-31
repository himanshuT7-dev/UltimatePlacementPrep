import React, { useRef, useState } from 'react';

/**
 * LiquidMetal3DCard — Multi-Layer 3D Depth Card for Liquid Metal.
 * Separates inner child elements into true 3D spatial layers (translateZ)
 * that pop out toward the user when hovered and tilted in 3D.
 */
export default function LiquidMetal3DCard({ children, className = '', style = {}, depth = 40 }) {
  const cardRef = useRef(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [shine, setShine] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth rotational angle mapping
    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotX(rX);
    setRotY(rY);

    setShine({
      opacity: 0.4,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setShine({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0px)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        position: 'relative',
        willChange: 'transform',
      }}
    >
      {/* Liquid 3D Specular Highlight Ring */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)`,
          opacity: shine.opacity,
          pointerEvents: 'none',
          transition: 'opacity 0.25s ease',
          zIndex: 2,
        }}
      />

      {/* Children with 3D Spatial Layering */}
      <div style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * 3D Layer helper to apply depth (translateZ) to nested child elements.
 */
export function Layer3D({ children, z = 20, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `translateZ(${z}px)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.2s ease-out',
      }}
    >
      {children}
    </div>
  );
}

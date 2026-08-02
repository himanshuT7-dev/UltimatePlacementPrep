import React, { useRef, useCallback, useEffect } from 'react';

/**
 * Tilt3D — Zero-rerender, RAF-driven 3D perspective tilt.
 * 
 * Uses direct DOM style manipulation via refs instead of setState,
 * so React never re-renders during mouse movement. All transforms
 * are GPU-composited (transform + opacity only).
 */
export default function Tilt3D({ children, className = '', style = {}, maxTilt = 10, scale = 1.02, depth = 0 }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });
  const currentRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });
  const activeRef = useRef(false);

  const lerp = (a, b, t) => a + (b - a) * t;

  // Single RAF loop that smoothly interpolates toward target
  const animate = useCallback(() => {
    const c = currentRef.current;
    const t = targetRef.current;
    const smoothing = 0.12; // Lower = smoother but slower

    c.rotateX = lerp(c.rotateX, t.rotateX, smoothing);
    c.rotateY = lerp(c.rotateY, t.rotateY, smoothing);
    c.scale = lerp(c.scale, t.scale, smoothing);

    // Only write to DOM if card exists
    if (cardRef.current) {
      cardRef.current.style.transform =
        `perspective(800px) rotateX(${c.rotateX.toFixed(3)}deg) rotateY(${c.rotateY.toFixed(3)}deg) scale3d(${c.scale.toFixed(4)}, ${c.scale.toFixed(4)}, 1)`;
    }

    if (shineRef.current) {
      // Map rotation to shine position
      const shineX = 50 + c.rotateY * 3;
      const shineY = 50 - c.rotateX * 3;
      shineRef.current.style.background =
        `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.18) 0%, transparent 55%)`;
      shineRef.current.style.opacity = activeRef.current ? '1' : '0';
    }

    // Check if we're close enough to stop
    const diff = Math.abs(c.rotateX - t.rotateX) + Math.abs(c.rotateY - t.rotateY) + Math.abs(c.scale - t.scale);
    if (diff > 0.01 || activeRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const rectRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    if (!rectRef.current) rectRef.current = cardRef.current.getBoundingClientRect();
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRef.current.rotateX = ((y - centerY) / centerY) * -maxTilt;
    targetRef.current.rotateY = ((x - centerX) / centerX) * maxTilt;
    targetRef.current.scale = scale;
    activeRef.current = true;
    startLoop();
  }, [maxTilt, scale, startLoop]);

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    targetRef.current.rotateX = 0;
    targetRef.current.rotateY = 0;
    targetRef.current.scale = 1;
    activeRef.current = false;
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        position: 'relative',
      }}
    >
      {children}

      {/* Specular shine — driven by ref, not state */}
      <div
        ref={shineRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
          zIndex: 10,
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  );
}

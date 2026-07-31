import React, { useEffect, useRef } from 'react';

/**
 * CyberBackground — Hyper-Realistic 3D WebGL Liquid Metal (Zero-Glitch, 120 FPS).
 * Uses a raw WebGL fragment shader for fluid noise displacement and specular lighting,
 * completely bypassing heavy DOM meshes or Three.js dependencies for buttery-smooth performance.
 */
export default function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    let animId;

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Liquid Metal Fragment Shader
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // Pseudo-random function
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // 2D Noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      // Fractional Brownian Motion
      float fbm(vec2 p) {
        float f = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          f += amp * noise(p);
          p *= 2.0;
          amp *= 0.5;
        }
        return f;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv.x *= u_resolution.x / u_resolution.y;

        // Mouse interaction influence
        vec2 mouseUV = u_mouse / u_resolution.xy;
        mouseUV.x *= u_resolution.x / u_resolution.y;
        float distToMouse = distance(uv, mouseUV);
        float mouseEffect = smoothstep(0.4, 0.0, distToMouse);

        // Animate the liquid
        vec2 movement = vec2(u_time * 0.08, u_time * 0.12);
        
        // Distort UVs based on noise and mouse
        float q = fbm(uv * 2.5 + movement);
        vec2 distorted = uv + vec2(q * 0.4, q * 0.4) + (uv - mouseUV) * mouseEffect * 0.1;
        
        // Calculate the height map value
        float h = fbm(distorted * 3.0 - movement * 1.2);
        
        // Calculate normals for lighting by sampling nearby height
        float dx = fbm((distorted + vec2(0.005, 0.0)) * 3.0 - movement * 1.2) - h;
        float dy = fbm((distorted + vec2(0.0, 0.005)) * 3.0 - movement * 1.2) - h;
        vec3 normal = normalize(vec3(-dx * 12.0, -dy * 12.0, 1.0));
        
        // Lighting vectors
        vec3 lightDir1 = normalize(vec3(0.5, 0.5, 1.0)); // Main ambient light
        vec3 lightDir2 = normalize(vec3(-0.6, -0.2, 0.6)); // Amber highlight
        vec3 lightDir3 = normalize(vec3(0.2, -0.6, 0.5)); // Sky/Cyan highlight
        
        // Diffuse
        float diff1 = max(dot(normal, lightDir1), 0.0);
        float diff2 = max(dot(normal, lightDir2), 0.0);
        float diff3 = max(dot(normal, lightDir3), 0.0);
        
        // Specular (shininess)
        vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
        vec3 half1 = normalize(lightDir1 + viewDir);
        vec3 half2 = normalize(lightDir2 + viewDir);
        vec3 half3 = normalize(lightDir3 + viewDir);
        
        float spec1 = pow(max(dot(normal, half1), 0.0), 32.0);
        float spec2 = pow(max(dot(normal, half2), 0.0), 24.0);
        float spec3 = pow(max(dot(normal, half3), 0.0), 24.0);
        
        // Colors
        vec3 baseColor = vec3(0.04, 0.06, 0.09); // Deep Titanium
        vec3 amber = vec3(0.96, 0.62, 0.04);
        vec3 sky = vec3(0.22, 0.74, 0.97);
        vec3 violet = vec3(0.65, 0.55, 0.98);
        
        // Combine lighting
        vec3 finalColor = baseColor * (diff1 * 0.8 + 0.2);
        finalColor += amber * (diff2 * 0.35 + spec2 * 0.8) * (1.0 + mouseEffect * 0.5);
        finalColor += sky * (diff3 * 0.25 + spec3 * 0.6);
        
        // Extra specular glint on edges
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
        finalColor += violet * fresnel * 0.4;
        
        // Add some noise texture grain to make it look like metal
        float grain = hash(uv + u_time) * 0.02;
        finalColor += grain;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      // Invert Y for WebGL coordinates
      targetMouseY = window.innerHeight - e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      // Use devicePixelRatio for crisp rendering, capped at 1.5 to guarantee 120 FPS
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const startTime = performance.now();

    const render = () => {
      const currentTime = performance.now();
      gl.uniform1f(timeLocation, (currentTime - startTime) * 0.001);
      
      // Smoothly interpolate mouse position for fluid interaction
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      // Convert to canvas space
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      gl.uniform2f(mouseLocation, mouseX * dpr, mouseY * dpr);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // So it doesn't block UI interactions
        zIndex: 0,
        opacity: 0.85, // Perfectly blends with the deep dark theme
      }}
    />
  );
}

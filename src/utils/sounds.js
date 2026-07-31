// Lightweight UI sound effects using Web Audio API

const playTone = (frequency, type, duration, vol) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Fade out to avoid clicks
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio context errors
  }
};

export const playSound = {
  click: () => playTone(600, 'sine', 0.1, 0.05),
  success: () => {
    playTone(440, 'sine', 0.1, 0.05); // A4
    setTimeout(() => playTone(554.37, 'sine', 0.15, 0.05), 100); // C#5
    setTimeout(() => playTone(659.25, 'sine', 0.3, 0.05), 250); // E5
  },
  error: () => {
    playTone(300, 'sawtooth', 0.1, 0.05);
    setTimeout(() => playTone(250, 'sawtooth', 0.2, 0.05), 150);
  },
  ding: () => playTone(800, 'sine', 0.3, 0.05)
};

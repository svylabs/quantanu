import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const QubitVisualizer: React.FC = () => {
  const [theta, setTheta] = useState(0); // Polar angle (0 to PI)
  const [phi, setPhi] = useState(0);     // Azimuthal angle (0 to 2PI)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants for rendering
  const size = 300;
  const radius = 100;
  const center = size / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Draw Sphere (Wireframe/Outline)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // Main circle
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Equator ellipse
      ctx.beginPath();
      ctx.ellipse(center, center, radius, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Vertical ellipse
      ctx.beginPath();
      ctx.ellipse(center, center, radius * 0.3, radius, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Axes
      ctx.setLineDash([5, 5]);
      // Z-axis (|0> to |1>)
      ctx.beginPath();
      ctx.moveTo(center, center - radius);
      ctx.lineTo(center, center + radius);
      ctx.stroke();
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(center - radius, center);
      ctx.lineTo(center + radius, center);
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.fillStyle = 'white';
      ctx.font = '14px JetBrains Mono, monospace';
      ctx.fillText('|0⟩', center - 10, center - radius - 10);
      ctx.fillText('|1⟩', center - 10, center + radius + 20);
      
      // Calculate state vector tip in 3D-to-2D projection
      // theta: angle from Z-axis (0 is |0>, PI is |1>)
      // phi: angle in XY plane
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      // Project 3D (x,y,z) to 2D (canvasX, canvasY)
      // We'll use a simple isometric-like projection
      const canvasX = center + x - (y * 0.3);
      const canvasY = center - z + (y * 0.2);

      // Draw vector
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(canvasX, canvasY);
      ctx.strokeStyle = 'var(--accent-cyan)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw point at the tip
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--accent-cyan)';
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'var(--accent-cyan)';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    render();
  }, [theta, phi]);

  // Probability calculations
  const prob0 = Math.pow(Math.cos(theta / 2), 2);
  const prob1 = Math.pow(Math.sin(theta / 2), 2);

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', background: 'rgba(10, 10, 15, 0.4)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <canvas 
            ref={canvasRef} 
            width={size} 
            height={size}
            style={{ maxWidth: '100%' }}
          />
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
            Bloch Sphere Visualization
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.8rem', fontSize: '1rem' }}>Quantum Gates</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setTheta(0); setPhi(0); }}
                className="gate-btn"
                title="Reset to |0⟩"
              >
                Reset
              </button>
              <button 
                onClick={() => { setTheta(Math.PI - theta); setPhi((phi + Math.PI) % (Math.PI * 2)); }}
                className="gate-btn"
                title="Rotate 180° around X-axis"
              >
                X (NOT)
              </button>
              <button 
                onClick={() => {
                  // Simplified Hadamard: If at pole, go to equator. If at equator, go to pole.
                  if (theta < 0.1) { setTheta(Math.PI / 2); setPhi(0); }
                  else if (Math.abs(theta - Math.PI) < 0.1) { setTheta(Math.PI / 2); setPhi(Math.PI); }
                  else { setTheta(0); setPhi(0); }
                }}
                className="gate-btn"
                title="Create Superposition"
              >
                H (Hadamard)
              </button>
              <button 
                onClick={() => {
                  const result = Math.random() < prob0 ? 0 : 1;
                  setTheta(result === 0 ? 0 : Math.PI);
                  setPhi(0);
                  alert(`Measured: |${result}⟩`);
                }}
                className="gate-btn highlight"
                style={{ background: 'var(--accent-cyan)', color: 'black', fontWeight: 'bold' }}
              >
                Measure
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '0.8rem', fontSize: '1rem' }}>Manual Controls</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>θ (Polar): {theta.toFixed(2)}</label>
              </div>
              <input 
                type="range" 
                min="0" 
                max={Math.PI} 
                step="0.01" 
                value={theta} 
                onChange={(e) => setTheta(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>φ (Phase): {phi.toFixed(2)}</label>
              </div>
              <input 
                type="range" 
                min="0" 
                max={Math.PI * 2} 
                step="0.01" 
                value={phi} 
                onChange={(e) => setPhi(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
              />
            </div>
          </div>

          <div className="glass" style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Measurement Probabilities
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  <span>|0⟩</span>
                  <span style={{ color: 'white' }}>{(prob0 * 100).toFixed(1)}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prob0 * 100}%` }}
                    style={{ height: '100%', background: 'var(--accent-cyan)' }}
                  />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  <span>|1⟩</span>
                  <span style={{ color: 'white' }}>{(prob1 * 100).toFixed(1)}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prob1 * 100}%` }}
                    style={{ height: '100%', background: 'var(--accent-purple)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: 'var(--font-mono)' }}>
            |ψ⟩ = cos(θ/2)|0⟩ + e^iφ sin(θ/2)|1⟩
          </div>
        </div>
      </div>
    </div>
  );
};

export default QubitVisualizer;

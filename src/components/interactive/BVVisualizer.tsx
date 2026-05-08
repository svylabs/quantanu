import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap, Search } from 'lucide-react';

const BVVisualizer: React.FC = () => {
  const [secret, setSecret] = useState('101');
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [measuredValue, setMeasuredValue] = useState<string | null>(null);

  const steps = [
    { name: 'Init', description: 'Initialize qubits to |000⟩ and |-⟩' },
    { name: 'Superpose', description: 'Apply Hadamard to all qubits' },
    { name: 'Oracle', description: 'Hidden string shifts phases' },
    { name: 'Interfere', description: 'Apply Hadamard again' },
    { name: 'Measure', description: 'Extract the hidden bitstring' }
  ];

  const bitLength = secret.length;

  useEffect(() => {
    let timer: any;
    if (isRunning && step < steps.length - 1) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 1500);
    } else if (step === steps.length - 1) {
      setMeasuredValue(secret);
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, step, secret]);

  const reset = () => {
    setStep(0);
    setIsRunning(false);
    setMeasuredValue(null);
  };

  const toggleBit = (index: number) => {
    if (isRunning || step > 0) return;
    const newSecret = secret.split('');
    newSecret[index] = newSecret[index] === '0' ? '1' : '0';
    setSecret(newSecret.join(''));
  };

  return (
    <div className="glass" style={{ 
      padding: '2rem', 
      borderRadius: '1.5rem', 
      background: 'rgba(10, 10, 20, 0.6)',
      border: '1px solid var(--border-color)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{ 
        position: 'absolute', 
        top: '-100px', 
        right: '-100px', 
        width: '300px', 
        height: '300px', 
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.05) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} className="text-cyan-400" style={{ color: 'var(--accent-cyan)' }} />
              BV Algorithm Lab
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Solving the Hidden Bitstring Problem
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={reset}
              className="gate-btn"
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={16} /> Reset
            </button>
            <button 
              onClick={() => setIsRunning(true)}
              disabled={isRunning || step === steps.length - 1}
              className="gate-btn highlight"
              style={{ 
                padding: '0.5rem 1.5rem', 
                background: isRunning ? 'rgba(255,255,255,0.1)' : 'var(--accent-cyan)',
                color: isRunning ? 'white' : 'black',
                fontWeight: 'bold',
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem' 
              }}
            >
              <Play size={16} /> {isRunning ? 'Running...' : 'Start Execution'}
            </button>
          </div>
        </div>

        {/* Secret Configuration */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Hidden Bitstring (s)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {secret.split('').map((bit, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleBit(i)}
                style={{
                  width: '50px',
                  height: '60px',
                  borderRadius: '12px',
                  background: bit === '1' ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${bit === '1' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  color: bit === '1' ? 'var(--accent-cyan)' : 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (isRunning || step > 0) ? 'default' : 'pointer'
                }}
              >
                {bit}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Qubit States Visualization */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${bitLength}, 1fr)`, 
          gap: '1rem', 
          marginBottom: '3rem',
          minHeight: '200px',
          alignItems: 'center'
        }}>
          {secret.split('').map((_, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ 
                height: '120px', 
                position: 'relative', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {/* Qubit representation changes based on step */}
                <motion.div
                  animate={{
                    scale: step === 0 ? 1 : 1.2,
                    rotate: (step >= 2 && secret[i] === '1') ? 180 : 0,
                    opacity: step === 5 ? 0.5 : 1
                  }}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid var(--accent-purple)',
                    background: step === 1 ? 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    width: '4px', 
                    height: '30px', 
                    background: 'var(--accent-cyan)', 
                    position: 'absolute',
                    top: '0',
                    transformOrigin: 'bottom center'
                  }} />
                  <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold', zIndex: 2 }}>
                    {step === 0 ? '|0⟩' : (step === 4 ? `|${secret[i]}⟩` : '|+⟩')}
                  </span>
                </motion.div>
                
                {/* Visual indicator for Oracle step */}
                {step === 2 && secret[i] === '1' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.7rem'
                    }}
                  >
                    PHASE FLIP
                  </motion.div>
                )}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                Qubit {i}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ 
                fontSize: '0.7rem', 
                color: step >= i ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: step === i ? 'bold' : 'normal',
                transition: 'all 0.3s'
              }}>
                {s.name}
              </div>
            ))}
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              style={{ height: '100%', background: 'var(--accent-cyan)' }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{ color: 'white', fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center' }}
            >
              {steps[step].description}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Measurement Result */}
        <AnimatePresence>
          {measuredValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(0, 255, 255, 0.1)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '1rem',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem'
              }}
            >
              <div style={{ color: 'var(--accent-cyan)' }}>
                <Search size={32} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'white' }}>Hidden String Found!</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-cyan)', letterSpacing: '0.2em' }}>
                  {measuredValue}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BVVisualizer;

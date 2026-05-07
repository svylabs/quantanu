import React, { useState, useMemo } from 'react';
import { Zap, AlertTriangle, Cpu } from 'lucide-react';

const ECCVisualizer: React.FC = () => {
  const [keySize, setKeySize] = useState(256);
  
  const stats = useMemo(() => {
    // Very rough approximations for visualization purposes
    const classicalOperations = Math.pow(2, keySize / 2); // Pollard's rho
    // Shor's algorithm for ECC is roughly O(n^3) where n is bit length
    const quantumOperations = Math.pow(keySize, 3);
    
    // Estimates (Source: various research papers on Shor's)
    // For 256-bit ECC, ~3100 logical qubits, ~10^8 - 10^9 gates
    const estimateTime = keySize <= 256 ? '30 - 60 minutes' : '2 - 8 hours';
    const estimateCost = keySize <= 256 ? '$50,000' : '$250,000'; // Purely hypothetical "Quantum Computing as a Service" cost
    
    return {
      classical: classicalOperations,
      quantum: quantumOperations,
      time: estimateTime,
      cost: estimateCost,
      isVulnerable: true
    };
  }, [keySize]);

  const formatNumber = (num: number) => {
    if (num > 1e15) return `~2^${Math.round(Math.log2(num))}`;
    return num.toLocaleString();
  };

  return (
    <div className="glass" style={{ 
      padding: '2rem', 
      margin: '2rem 0', 
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(10, 10, 15, 0.6)',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} className="text-cyan" />
          Quantum Threat Simulator: ECC-{keySize} vs Shor's
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Adjust the key size to see how classical vs quantum attack complexity scales.
        </p>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ECC Key Size (bits)</span>
          <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{keySize} bits</span>
        </div>
        <input 
          type="range" 
          min="128" 
          max="512" 
          step="32"
          value={keySize} 
          onChange={(e) => setKeySize(parseInt(e.target.value))}
          style={{ 
            width: '100%', 
            accentColor: 'var(--accent-cyan)',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
          <span>128 (Legacy)</span>
          <span>256 (Standard)</span>
          <span>512 (High Security)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Classical Column */}
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '12px', 
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <Cpu size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Classical Attack</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
            {formatNumber(stats.classical)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Operations to crack (Pollard's Rho)
          </div>
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '0.5rem', 
            borderRadius: '6px', 
            background: 'rgba(0, 255, 255, 0.1)', 
            color: 'var(--accent-cyan)',
            fontSize: '0.8rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            SECURE
          </div>
        </div>

        {/* Quantum Column */}
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '12px', 
          background: 'rgba(255, 100, 100, 0.05)',
          border: '1px solid rgba(255, 100, 100, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <Zap size={16} style={{ color: '#ff4d4d' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantum Attack</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff4d4d', marginBottom: '0.5rem' }}>
            {formatNumber(stats.quantum)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Operations to crack (Shor's)
          </div>
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '0.5rem', 
            borderRadius: '6px', 
            background: 'rgba(255, 77, 77, 0.2)', 
            color: '#ff4d4d',
            fontSize: '0.8rem',
            textAlign: 'center',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}>
            <AlertTriangle size={14} /> VULNERABLE
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem' 
      }}>
        <div style={{ 
          padding: '1rem', 
          borderRadius: '8px', 
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Est. Time (Quantum)</div>
          <div style={{ fontSize: '1rem', color: 'white', fontWeight: 600 }}>{stats.time}</div>
        </div>
        <div style={{ 
          padding: '1rem', 
          borderRadius: '8px', 
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Est. Cost (Future)</div>
          <div style={{ fontSize: '1rem', color: 'white', fontWeight: 600 }}>{stats.cost}</div>
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        borderRadius: '8px', 
        background: 'rgba(255, 255, 255, 0.02)',
        fontSize: '0.85rem',
        lineHeight: 1.6,
        color: 'var(--text-secondary)',
        borderLeft: '2px solid var(--accent-purple)',
        whiteSpace: 'normal',
        wordBreak: 'break-word'
      }}>
        <strong>Insight:</strong> While a classical computer needs roughly 2<sup>128</sup> operations to break a 256-bit ECC key (taking billions of years), a quantum computer running Shor's algorithm could do it in approximately {formatNumber(stats.quantum)} logic operations. This is the <strong>Exponential vs Polynomial</strong> gap.
      </div>
    </div>
  );
};

export default ECCVisualizer;

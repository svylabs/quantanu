import React from 'react';
import { Shield } from 'lucide-react';


const Navbar: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  return (
    <nav style={{
      zIndex: 100,
      padding: '0.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
      background: 'transparent'
    }}>
      <div 
        onClick={onHome}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          padding: '0.5rem',
          borderRadius: '8px',
          display: 'flex'
        }}>
          <Shield size={24} color="white" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span className="display-font" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
            Quanta<span style={{ color: 'var(--accent-cyan)' }}>Nu</span>
          </span>
          <span style={{ 
            fontSize: '0.65rem', 
            color: 'var(--text-secondary)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em',
            marginTop: '2px'
          }}>
            Exploring the quantum frontier
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {/* Navigation spacer */}
      </div>


    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Tag as TagIcon, Hash } from 'lucide-react';

interface TagSidebarProps {
  tags: Record<string, number>;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const TagSidebar: React.FC<TagSidebarProps> = ({ tags, selectedTag, onSelectTag }) => {
  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);

  return (
    <aside className="glass" style={{
      padding: '1.5rem',
      position: 'sticky',
      top: '6rem',
      height: 'fit-content',
      minWidth: '280px',
      border: '1px solid rgba(139, 92, 246, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <TagIcon size={18} color="var(--accent-purple)" />
        <h3 style={{ fontSize: '1rem', color: 'white' }}>Topics</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => onSelectTag(null)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: selectedTag === null ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
            color: selectedTag === null ? 'var(--accent-purple)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            textAlign: 'left'
          }}
        >
          <span>All Articles</span>
        </button>

        {sortedTags.map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: selectedTag === tag ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              color: selectedTag === tag ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hash size={14} />
              <span style={{ textTransform: 'capitalize' }}>{tag}</span>
            </div>
            <span style={{ 
              fontSize: '0.75rem', 
              opacity: 0.6,
              background: 'rgba(255,255,255,0.05)',
              padding: '2px 8px',
              borderRadius: '10px'
            }}>{count}</span>
          </button>
        ))}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        paddingTop: '1.5rem', 
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <p>A personal learning blog documenting developments in quantum foundations, technology and adoption</p>


      </div>
    </aside>
  );
};

export default TagSidebar;

import React from 'react';
import type { PostMetadata } from '../lib/blog';
import { BookOpen, Hash } from 'lucide-react';

interface ArticleSidebarProps {
  posts: PostMetadata[];
  activeSlug: string | null;
  onSelectPost: (slug: string) => void;
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ posts, activeSlug, onSelectPost }) => {
  return (
    <aside className="glass" style={{
      padding: '1.5rem',
      position: 'sticky',
      top: '6rem',
      maxHeight: 'calc(100vh - 8rem)',
      overflowY: 'auto',
      minWidth: '280px',
      border: '1px solid rgba(139, 92, 246, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <BookOpen size={18} color="var(--accent-cyan)" />
        <h3 style={{ fontSize: '1rem', color: 'white' }}>Library Content</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {posts.map((post) => (
          <button
            key={post.slug}
            onClick={() => onSelectPost(post.slug)}
            className="sidebar-item"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: activeSlug === post.slug ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              color: activeSlug === post.slug ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              border: '1px solid',
              borderColor: activeSlug === post.slug ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            <div style={{ marginTop: '0.2rem', opacity: activeSlug === post.slug ? 1 : 0.5 }}>
              <Hash size={14} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: activeSlug === post.slug ? 600 : 400,
                lineHeight: 1.4
              }}>
                {post.title}
              </span>
              {activeSlug === post.slug && (
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>
                  Reading Now
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          transform: translateX(4px);
        }
        
        /* Custom scrollbar for the sidebar */
        aside::-webkit-scrollbar {
          width: 4px;
        }
        aside::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
      `}</style>
    </aside>
  );
};

export default ArticleSidebar;

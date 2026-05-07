import React from 'react';
import type { Post, PostMetadata } from '../lib/blog';
import ReactMarkdown from 'react-markdown';
import { Calendar, Tag, ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import ECCVisualizer from './interactive/ECCVisualizer';
import QubitVisualizer from './interactive/QubitVisualizer';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

interface ArticleViewProps {
  post: Post;
  prevPost: PostMetadata | null;
  nextPost: PostMetadata | null;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ post, prevPost, nextPost, onBack, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass"
      style={{
        padding: '3rem',
        border: '1px solid var(--border-color)',
        width: '100%'
      }}
    >
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--accent-cyan)',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          fontWeight: 600
        }}
      >
        <ChevronLeft size={18} /> Back to Library
      </button>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} />
            <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={16} />
            <span>{post.tags.join(', ')}</span>
          </div>
        </div>

        <h1 style={{ 
          fontSize: '2.5rem', 
          color: 'white', 
          marginBottom: '1.5rem',
          lineHeight: 1.1
        }}>
          {post.title}
        </h1>

        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
          borderRadius: '2px'
        }} />
      </div>

      <div className="markdown-content" style={{ 
        color: 'var(--text-primary)', 
        fontSize: '1.1rem', 
        lineHeight: 1.8 
      }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ children }) => <h1 style={{ color: 'white', marginTop: '2.5rem', marginBottom: '1.5rem' }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ color: 'var(--accent-cyan)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{children}</h3>,
            p: ({ children }) => <p style={{ marginBottom: '1.5rem' }}>{children}</p>,
            ul: ({ children }) => <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', listStyleType: 'square' }}>{children}</ul>,
            li: ({ children }) => <li style={{ marginBottom: '0.5rem' }}>{children}</li>,
            pre: ({ children }) => {
              // If the child is the ECCVisualizer (via the code mapping), 
              // we don't want to wrap it in a <pre> tag.
              return <div style={{ margin: '2rem 0' }}>{children}</div>;
            },
            code: (props) => {
              const { className, children } = props;
              const match = /language-([\w-]+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (language === 'interactive-ecc') {
                return <ECCVisualizer />;
              }
              
              if (language === 'interactive-qubit') {
                return <QubitVisualizer />;
              }
              
              return (
                <code className={className} style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  color: 'var(--accent-purple)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9em'
                }}>
                  {children}
                </code>
              );
            },
            blockquote: ({ children }) => (
              <blockquote style={{ 
                borderLeft: '4px solid var(--accent-cyan)', 
                paddingLeft: '1.5rem', 
                margin: '2rem 0', 
                fontStyle: 'italic',
                color: 'var(--text-secondary)'
              }}>
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div style={{ overflowX: 'auto', margin: '2rem 0' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem'
                }}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead style={{ background: 'rgba(255,255,255,0.05)' }}>{children}</thead>,
            th: ({ children }) => <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid var(--border-color)', color: 'white' }}>{children}</th>,
            td: ({ children }) => <td style={{ padding: '1rem', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{children}</td>
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <div style={{ 
        marginTop: '4rem', 
        paddingTop: '3rem', 
        borderTop: '1px solid var(--border-color)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {prevPost ? (
          <button 
            onClick={() => onNavigate(prevPost.slug)}
            className="glass"
            style={{
              padding: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'var(--accent-purple)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <ArrowLeft size={14} /> Previous Article
            </div>
            <h4 style={{ color: 'white', margin: 0, fontSize: '1.1rem', lineHeight: 1.3 }}>{prevPost.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {prevPost.summary}
            </p>
          </button>
        ) : <div />}

        {nextPost ? (
          <button 
            onClick={() => onNavigate(nextPost.slug)}
            className="glass"
            style={{
              padding: '1.5rem',
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.75rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Next Article <ArrowRight size={14} />
            </div>
            <h4 style={{ color: 'white', margin: 0, fontSize: '1.1rem', lineHeight: 1.3 }}>{nextPost.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {nextPost.summary}
            </p>
          </button>
        ) : <div />}
      </div>
    </motion.div>
  );
};

export default ArticleView;

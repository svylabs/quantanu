import React from 'react';
import type { Post } from '../lib/blog';
import ReactMarkdown from 'react-markdown';
import { Calendar, Tag, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import ECCVisualizer from './interactive/ECCVisualizer';
import QubitVisualizer from './interactive/QubitVisualizer';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ArticleViewProps {
  post: Post;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ post, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass"
      style={{
        padding: '3rem',
        border: '1px solid var(--border-color)',
        maxWidth: '900px',
        margin: '0 auto'
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
          remarkPlugins={[remarkMath]}
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
            )
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default ArticleView;

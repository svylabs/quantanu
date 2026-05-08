import React from 'react';
import type { Post, PostMetadata } from '../lib/blog';
import ReactMarkdown from 'react-markdown';
import { Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ECCVisualizer from './interactive/ECCVisualizer';
import QubitVisualizer from './interactive/QubitVisualizer';
import BVVisualizer from './interactive/BVVisualizer';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

import rehypeSlug from 'rehype-slug';
import { ChevronRight, ChevronLeft, List } from 'lucide-react';

interface ArticleViewProps {
  post: Post;
  prevPost: PostMetadata | null;
  nextPost: PostMetadata | null;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ post, prevPost, nextPost, onBack, onNavigate }) => {
  const [isTOCOpen, setIsTOCOpen] = React.useState(true);

  // Extract headings for TOC with hierarchical numbering
  const headings = React.useMemo(() => {
    if (!post?.content) return [];
    const headingRegex = /^#{2,3}\s+(.*)$/gm;
    const matches = Array.from(post.content.matchAll(headingRegex));
    
    let h2Count = 0;
    let h3Count = 0;
    
    return matches.map(match => {
      const text = match[1].trim();
      const level = match[0].split(' ')[0].length;
      
      let number = '';
      if (level === 2) {
        h2Count++;
        h3Count = 0; // Reset sub-counter
        number = `${h2Count}. `;
      } else if (level === 3) {
        h3Count++;
        number = `${h2Count}.${h3Count} `;
      }
      
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      return { text: `${number}${text}`, level, id };
    });
  }, [post.content]);

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass"
        style={{
          padding: '3rem',
          border: '1px solid var(--border-color)',
          flex: 1,
          minWidth: 0
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
            rehypePlugins={[rehypeKatex, rehypeSlug]}
            components={{
              h1: ({ children }) => <h1 style={{ color: 'white', marginTop: '2.5rem', marginBottom: '1.5rem' }}>{children}</h1>,
              h2: ({ node, children, ...props }) => {
                return <h2 {...props} style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{children}</h2>
              },
              h3: ({ node, children, ...props }) => {
                return <h3 {...props} style={{ color: 'var(--accent-cyan)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{children}</h3>
              },
              p: ({ children }) => <p style={{ marginBottom: '1.5rem' }}>{children}</p>,
              ul: ({ children }) => <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', listStyleType: 'square' }}>{children}</ul>,
              li: ({ children }) => <li style={{ marginBottom: '0.5rem' }}>{children}</li>,
              pre: ({ children }) => {
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
                
                if (language === 'interactive-bv') {
                  return <BVVisualizer />;
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

      {/* Table of Contents Overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        bottom: 0, 
        width: '1px', // Anchor for absolute positioning
        zIndex: 1000 
      }}>
        <div style={{ position: 'sticky', top: '2rem', height: 'calc(100vh - 4rem)', display: 'flex', alignItems: 'flex-start' }}>
          {/* Floating TOC Toggle Button (when closed) */}
          <AnimatePresence>
            {!isTOCOpen && headings.length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => setIsTOCOpen(true)}
                className="glass"
                style={{
                  position: 'absolute',
                  right: '-1.5rem',
                  width: '3rem',
                  height: '4rem',
                  borderRadius: '12px 0 0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--border-color)',
                  borderRight: 'none',
                  boxShadow: '-4px 0 15px rgba(0,0,0,0.3)',
                }}
                whileHover={{ x: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <ChevronLeft size={24} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* TOC Panel */}
          <AnimatePresence>
            {isTOCOpen && headings.length > 0 && (
              <motion.aside
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="glass"
                style={{
                  position: 'absolute',
                  right: '-1.5rem',
                  width: '320px',
                  maxHeight: 'calc(100vh - 4rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border-color)',
                  boxShadow: '-10px 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <List size={18} style={{ color: 'var(--accent-cyan)' }} />
                    <h4 style={{ color: 'white', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contents</h4>
                  </div>
                  <button 
                    onClick={() => setIsTOCOpen(false)} 
                    style={{ 
                      color: 'var(--text-secondary)',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    className="hover-bright"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <nav style={{ 
                  padding: '1.5rem', 
                  overflowY: 'auto', 
                  flex: 1,
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.5rem',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--border-color) transparent'
                }}>
                  {headings.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.id}`}
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        padding: '0.6rem 0.75rem',
                        paddingLeft: h.level === 3 ? '1.5rem' : '0.75rem',
                        borderRadius: '6px',
                        transition: 'all 0.2s',
                        lineHeight: 1.4,
                        display: 'block',
                        borderLeft: h.level === 2 ? '2px solid transparent' : 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        if (h.level === 2) e.currentTarget.style.borderLeftColor = 'var(--accent-cyan)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.background = 'transparent';
                        if (h.level === 2) e.currentTarget.style.borderLeftColor = 'transparent';
                      }}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;

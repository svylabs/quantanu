import type { PostMetadata } from '../lib/blog';

import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface ArticleListProps {
  posts: PostMetadata[];
  onSelectPost: (slug: string) => void;
}


const ArticleList: React.FC<ArticleListProps> = ({ posts, onSelectPost }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {posts.map((post, index) => (
        <a
          key={post.slug}
          href={`#${post.slug}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          onClick={(e) => {
            e.preventDefault();
            onSelectPost(post.slug);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass"
            style={{
              padding: '2rem',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ 
              borderColor: 'var(--accent-cyan)',
              transform: 'translateY(-4px)',
              background: 'rgba(17, 24, 39, 0.9)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: 'var(--accent-cyan)'
            }}>
              <Calendar size={14} />
              <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
            </div>

            <h2 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem', 
              color: 'white',
              lineHeight: 1.2
            }}>
              {post.title}
            </h2>

            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '1.5rem',
              fontSize: '1rem',
              lineHeight: 1.6
            }}>
              {post.summary}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ 
                    fontSize: '0.7rem', 
                    color: 'var(--accent-purple)',
                    background: 'rgba(139, 92, 246, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '100px',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: 'var(--accent-cyan)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                Read Article <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        </a>

      ))}
    </div>
  );
};

export default ArticleList;

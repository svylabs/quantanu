import { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import BlogLayout from './components/BlogLayout';
import ArticleList from './components/ArticleList';
import ArticleView from './components/ArticleView';
import TagSidebar from './components/TagSidebar';
import ArticleSidebar from './components/ArticleSidebar';
import { getPosts, getAllTags, getPostBySlug, getAdjacentPosts } from './lib/blog';

function App() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Hash-based routing for active post
  const activePostSlug = window.location.hash.replace('#', '') || null;
  const [, setTick] = useState(0); // For forcing re-render on hash change

  useState(() => {
    const handleHashChange = () => setTick(t => t + 1);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  const posts = useMemo(() => getPosts(), []);
  const tags = useMemo(() => getAllTags(), []);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(post => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  const activePost = useMemo(() => {
    if (!activePostSlug) return null;
    return getPostBySlug(activePostSlug);
  }, [activePostSlug]);

  const adjacentPosts = useMemo(() => {
    if (!activePostSlug) return { prev: null, next: null };
    return getAdjacentPosts(activePostSlug);
  }, [activePostSlug]);

  const handleHome = () => {
    window.location.hash = '';
    setSelectedTag(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (slug: string) => {
    window.location.hash = slug;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTag = (tag: string | null) => {
    setSelectedTag(tag);
    window.location.hash = ''; // Return to list view when filtering
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onHome={handleHome} />
      
      <div style={{ flex: 1, marginTop: '0' }}>
        {activePost ? (
          <BlogLayout
            sidebar={
              <ArticleSidebar 
                posts={posts} 
                activeSlug={activePostSlug} 
                onSelectPost={handleSelectPost} 
              />
            }
          >
            <ArticleView 
              post={activePost} 
              prevPost={adjacentPosts.prev}
              nextPost={adjacentPosts.next}
              onBack={() => window.location.hash = ''} 
              onNavigate={handleSelectPost}
            />
          </BlogLayout>
        ) : (
          <>
            <div className="container">
              <div style={{ 
                marginBottom: '3rem', 
                padding: '1.5rem 0', 
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontWeight: 500
              }}>
                <span>Physics</span>
                <span style={{ color: 'var(--accent-cyan)' }}>·</span>
                <span>Computation</span>
                <span style={{ color: 'var(--accent-cyan)' }}>·</span>
                <span>Cryptography</span>
                <span style={{ color: 'var(--accent-cyan)' }}>·</span>
                <span>Algorithms</span>
                <span style={{ color: 'var(--accent-cyan)' }}>·</span>
                <span>News</span>
              </div>
            </div>

            <BlogLayout
              sidebar={
                <TagSidebar 
                  tags={tags} 
                  selectedTag={selectedTag} 
                  onSelectTag={handleSelectTag} 
                />
              }
            >
              <ArticleList 
                posts={filteredPosts} 
                onSelectPost={handleSelectPost} 
              />
            </BlogLayout>
          </>
        )}
      </div>


    </div>
  );
}

export default App;

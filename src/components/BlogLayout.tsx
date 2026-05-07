import React from 'react';

interface BlogLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="container" style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 300px', 
      gap: '2.5rem',
      paddingBottom: '5rem'
    }}>
      <main>
        {children}
      </main>
      <aside>
        {sidebar}
      </aside>
    </div>
  );
};

export default BlogLayout;

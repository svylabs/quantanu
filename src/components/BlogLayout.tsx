import React from 'react';

interface BlogLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="container blog-layout">
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

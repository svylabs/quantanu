import postsData from '../content/posts.json';

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
}

export interface Post extends PostMetadata {
  content: string;
}

// Dynamically load all markdown files from the posts directory
const contentModules = import.meta.glob('../content/posts/*.md', { query: '?raw', eager: true });

export const getPosts = (): PostMetadata[] => {
  return (postsData as PostMetadata[]).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getPostBySlug = (slug: string): Post | undefined => {
  const metadata = (postsData as PostMetadata[]).find(p => p.slug === slug);
  if (!metadata) return undefined;
  
  // Construct the path and retrieve the raw markdown content
  const path = `../content/posts/${slug}.md`;
  const module = contentModules[path];
  
  // Handle both raw string and module object with default export
  const content = typeof module === 'string' ? module : (module as any)?.default || '';
  
  return {
    ...metadata,
    content
  };
};

export const getAllTags = (): Record<string, number> => {
  const posts = getPosts();
  const tags: Record<string, number> = {};
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
  });
  
  return tags;
};

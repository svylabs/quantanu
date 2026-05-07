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

export const getAdjacentPosts = (slug: string): { prev: PostMetadata | null, next: PostMetadata | null } => {
  const posts = getPosts();
  const currentIndex = posts.findIndex(p => p.slug === slug);
  
  if (currentIndex === -1) return { prev: null, next: null };
  
  // getPosts is sorted by date DESC (newest first)
  // next = newer = index - 1
  // prev = older = index + 1
  return {
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null
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

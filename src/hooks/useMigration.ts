import { useEffect } from 'react';

interface MigrationOptions {
  version: string;
  migrate: () => void;
}

export function useMigration({ version, migrate }: MigrationOptions) {
  useEffect(() => {
    const currentVersion = localStorage.getItem('app_version');
    
    if (currentVersion !== version) {
      try {
        migrate();
        localStorage.setItem('app_version', version);
        console.log(`Migrated to version ${version}`);
      } catch (error) {
        console.error('Migration failed:', error);
      }
    }
  }, [version, migrate]);
}

export function migratePostsData() {
  const savedPosts = localStorage.getItem('posts');
  if (savedPosts) {
    try {
      const posts = JSON.parse(savedPosts);
      const migratedPosts = posts.map((post: any) => ({
        ...post,
        viewedBy: post.viewedBy || [],
        comments: post.comments?.map((comment: any) => ({
          ...comment,
          viewedBy: comment.viewedBy || []
        })) || []
      }));
      
      localStorage.setItem('posts', JSON.stringify(migratedPosts));
      console.log('Posts migrated successfully');
    } catch (error) {
      console.error('Failed to migrate posts:', error);
    }
  }
}
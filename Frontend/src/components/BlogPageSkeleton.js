import React from 'react';
import './Skeleton.css';

const BlogPageSkeleton = () => {
  return (
    <div className="blog-page-container skeleton-container">
      <div className="blog-page-content">
        <main className="blog-main-content">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-meta"></div>
          <div className="skeleton skeleton-image"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text short"></div>
        </main>
        <aside className="blog-sidebar">
          <div className="author-card-skeleton">
            <div className="skeleton skeleton-author-image"></div>
            <div className="skeleton skeleton-author-name"></div>
            <div className="skeleton skeleton-author-bio"></div>
          </div>
          <div className="skeleton skeleton-sidebar-box"></div>
          <div className="skeleton skeleton-sidebar-box"></div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPageSkeleton;
// src/components/BlogCard.js
import React from 'react';
import './BlogCard.css';
import { Link } from 'react-router-dom';
// Import Font Awesome icons for calendar, likes, and comments
import { FaCalendarAlt, FaThumbsUp, FaRegCommentDots } from 'react-icons/fa'; // MODIFIED: Re-added FaRegCommentDots

const BlogCard = ({ blog }) => {
  const imageUrl = blog.blog_image;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month},${year}`;
  };

  return (
    <Link to={`/blog/${blog.id}`} className="blog-card-link">
      <div className="blog-card">
        <img src={imageUrl} alt={blog.title} className="blog-img" />
        <div className="blog-content">
          <div className="blog-meta">
            {/* Publishing Date */}
            <span className="blog-date-info">
              <FaCalendarAlt className="meta-icon" /> {formatDate(blog.publish_date)}
            </span>
            {/* Likes Count (Icon Only) */}
            <span className="blog-likes-info">
              <FaThumbsUp className="meta-icon" /> {blog.likes || 0} {/* MODIFIED: Removed "LIKES" text */}
            </span>
            {/* Comments Count (Icon Only) */}
            <span className="blog-comments-info"> {/* Re-using old class name, will style in CSS */}
              <FaRegCommentDots className="meta-icon" /> {blog.comments_count || 0} {/* MODIFIED: Removed "COMMENTS" text */}
            </span>
          </div>

          <h3>{blog.title}</h3>

          {/* REMOVED: Old comment count div */}
          {/* <div className="blog-comments-below-title">
            <FaRegCommentDots className="meta-icon" /> {blog.comments_count || 0} COMMENTS
          </div> */}

          <div className="author-info">
            <img
              src={blog.author_image}
              alt={blog.author_name}
              className="author-img"
            />
            <span className="author-name">by - {blog.author_name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

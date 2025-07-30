import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ShareSection from '../components/ShareSection';
import RatingSection from '../components/RatingSection';
import CommentSection from '../components/CommentSection';
import Footer from '../components/Footer'; // Import the new Footer component
import './BlogPage.css';

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  const fetchBlog = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/`);
      if (!response.ok) throw new Error('Blog not found');
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (!blog) {
    return (
        <div className="page-container">
            <main className="main-content">
                <div className="blog-page-container"><h2>Loading...</h2></div>
            </main>
            <Footer />
        </div>
    );
  }

  const createMarkup = (htmlContent) => ({ __html: htmlContent });

  return (
    <div className="page-container">
        <main className="main-content">
            <div className="blog-page-container">
                <div className="blog-page-content">
                    <div className="blog-main-content">
                        <header className="blog-header">
                            <h1>{blog.title}</h1>
                            <p className="blog-meta">
                              {/* FIX: Changed blog.upload_date to blog.publish_date to match the API */}
                              Published on {new Date(blog.publish_date).toLocaleDateString()}
                            </p>
                        </header>
                        <img src={blog.blog_image} alt={blog.title} className="blog-main-image" />
                        <article
                            className="blog-article-text"
                            dangerouslySetInnerHTML={createMarkup(blog.main_content)}
                        />
                    </div>

                    <aside className="blog-sidebar">
                        <div className="author-card">
                            <img src={blog.author_image} alt={blog.author_name} className="author-image" />
                            <h3>{blog.author_name}</h3>
                            <p className="author-bio">{blog.about_author}</p>
                        </div>
                        <ShareSection blogTitle={blog.title} />
                        <RatingSection
                            blogId={id}
                            likes={blog.likes}
                            dislikes={blog.dislikes}
                            onVoteSuccess={fetchBlog}
                        />
                        <CommentSection
                            blogId={id}
                            comments={blog.comments}
                            onCommentSuccess={fetchBlog}
                        />
                    </aside>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
};

export default BlogPage;

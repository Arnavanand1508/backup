// src/components/CommentSection.js
import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // NEW: Import uuid
import './CommentSection.css';

const API_URL = 'http://localhost:8000/api';

// NEW: Function to get or create a unique session ID for the user
const getUserSessionId = () => {
  let sessionId = localStorage.getItem('userSessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('userSessionId', sessionId);
  }
  return sessionId;
};

const CommentSection = ({ blogId, comments, onCommentSuccess }) => {
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
  const sessionId = getUserSessionId(); // NEW: Get the session ID

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName || !commentText) return;
    try {
      // MODIFIED: Added user_session_id to the request body
      await axios.post(`${API_URL}/comments/`, {
        blog: blogId,
        author_name: authorName,
        text: commentText,
        user_session_id: sessionId,
      });
      setAuthorName('');
      setCommentText('');
      onCommentSuccess(); 
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  
  // NEW: Function to handle comment deletion
  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`${API_URL}/comments/${commentId}/`, {
          // Send user_session_id in the request body for verification on the backend
          data: { user_session_id: sessionId }
        });
        onCommentSuccess(); // Refresh the comment list
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert(error.response?.data?.error || "Failed to delete comment.");
      }
    }
  };

  const handleViewMore = () => {
    setVisibleCommentsCount(prevCount => prevCount + 5);
  };

  const reversedComments = [...comments].reverse();
  const visibleComments = reversedComments.slice(0, visibleCommentsCount);

  return (
    <div className="comment-section">
      <h3 className="comment-title">Comments ({comments.length})</h3>
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Your Name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
        <textarea
          placeholder="Leave a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>

      <div className="comment-list">
        {visibleComments.length > 0 ? (
          visibleComments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.author_name}</strong>
                {/* NEW: Conditionally render Delete button */}
                {sessionId === comment.user_session_id && (
                  <button onClick={() => handleDelete(comment.id)} className="delete-btn">
                    Delete
                  </button>
                )}
              </div>
              <p>{comment.text}</p>
              <small>{new Date(comment.created_at).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
      
      {/* --- View More Logic --- */}
      <div className="view-more-container">
        {visibleCommentsCount === 5 && comments.length > 5 && (
            <div className="view-more-dropdown" onClick={handleViewMore}>
                View More Comments <span>&#9662;</span>
            </div>
        )}
        {visibleCommentsCount > 5 && visibleCommentsCount < comments.length && (
            <button className="view-more-btn" onClick={handleViewMore}>
                View More
            </button>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
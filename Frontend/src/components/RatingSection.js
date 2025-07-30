// src/components/RatingSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './RatingSection.css';

const API_URL = 'http://localhost:8000/api';

const getUserSessionId = () => {
  let sessionId = localStorage.getItem('userSessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('userSessionId', sessionId);
  }
  return sessionId;
};

const RatingSection = ({ blogId, likes, dislikes, onVoteSuccess }) => {
  const [userVote, setUserVote] = useState(null);
  const sessionId = getUserSessionId();

  useEffect(() => {
    const storedVote = localStorage.getItem(`vote_blog_${blogId}`);
    if (storedVote) setUserVote(storedVote);
  }, [blogId]);
  
  const handleVote = async (newVoteType) => {
    try {
      // If user clicks the same button, undo the vote
      if (userVote === newVoteType) {
        await axios.post(`${API_URL}/votes/undo/`, {
          user_session_id: sessionId,
          blog_id: blogId,
        });
        setUserVote(null);
        localStorage.removeItem(`vote_blog_${blogId}`);
      } else {
        // Otherwise, submit the new vote
        await axios.post(`${API_URL}/votes/submit/`, {
          user_session_id: sessionId,
          blog_id: blogId,
          vote_type: newVoteType === 'like' ? 1 : -1,
        });
        setUserVote(newVoteType);
        localStorage.setItem(`vote_blog_${blogId}`, newVoteType);
      }
      onVoteSuccess();
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
    <div className="rating-section">
      <div className="vote-buttons">
        <button 
          onClick={() => handleVote('like')} 
          className={`vote-btn ${userVote === 'like' ? 'like-active' : ''}`}
        >
          <FaThumbsUp /> {likes}
        </button>
        <button 
          onClick={() => handleVote('dislike')} 
          className={`vote-btn ${userVote === 'dislike' ? 'dislike-active' : ''}`}
        >
          <FaThumbsDown /> {dislikes}
        </button>
      </div>
    </div>
  );
};

export default RatingSection;

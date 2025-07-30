import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import './BlogLayout.css';
import { FaYoutube, FaInstagram, FaLinkedin, FaFacebookF, FaTwitter } from 'react-icons/fa';

const BlogLayout = () => {
    // --- State Logic ---
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPageLoaded, setPageLoaded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1); // Start at the first "real" slide
    const [isTransitioning, setIsTransitioning] = useState(false);
    const trackRef = useRef(null);
    const intervalRef = useRef(null);
    
    // --- Helper function to format date ---
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // --- Data Fetching Logic ---
    const fetchBlogs = useCallback(async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/blogs/', {
                cache: 'no-cache',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        }
    }, []);

    // --- Hooks ---
    useEffect(() => {
        const timer = setTimeout(() => setPageLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    useEffect(() => {
        const handleRefetch = () => {
            if (document.visibilityState === 'visible') {
                fetchBlogs();
            }
        };
        document.addEventListener('visibilitychange', handleRefetch);
        return () => {
            document.removeEventListener('visibilitychange', handleRefetch);
        };
    }, [fetchBlogs]);

    useEffect(() => {
        const targets = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );
        targets.forEach(target => {
            observer.observe(target);
        });
        return () => {
            targets.forEach(target => {
                observer.unobserve(target);
            });
        };
    }, [blogs]);

    // --- Memoized Calculations ---
    const filteredBlogs = useMemo(() => {
        if (!searchQuery) return [];
        return blogs.filter(blog =>
            (blog.title && blog.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (blog.author_name && blog.author_name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [blogs, searchQuery]);
    
    const featuredArticles = useMemo(() => {
        const blogsWithScore = blogs.map(blog => {
            const likes = blog.likes || 0;
            const dislikes = blog.dislikes || 0;
            const totalVotes = likes + dislikes;
            const score = totalVotes > 0 ? (likes / totalVotes) : 0;
            return { ...blog, score, likes };
        });

        const hasVotes = blogs.some(blog => (blog.likes || 0) > 0 || (blog.dislikes || 0) > 0);

        if (hasVotes) {
            blogsWithScore.sort((a, b) => {
                if (b.score !== a.score) { return b.score - a.score; }
                return b.likes - a.likes;
            });
        } else {
            blogsWithScore.sort(() => 0.5 - Math.random());
        }

        return blogsWithScore.slice(0, 5);
    }, [blogs]);

    // --- Carousel Logic ---

    const loopedBlogs = useMemo(() => {
        if (blogs.length === 0) return [];
        // Create clones for the seamless loop effect
        return [blogs[blogs.length - 1], ...blogs, blogs[0]];
    }, [blogs]);

    // This effect handles the "jump" back to the real slide after reaching a clone
    useEffect(() => {
        if (!trackRef.current) return;

        const handleTransitionEnd = () => {
            // After transitioning to a cloned slide, jump back to the real one
            if (currentIndex === 0) {
                trackRef.current.style.transition = 'none'; // Disable animation for the jump
                setCurrentIndex(loopedBlogs.length - 2);
            } else if (currentIndex === loopedBlogs.length - 1) {
                trackRef.current.style.transition = 'none';
                setCurrentIndex(1);
            }
            // The transition is now complete
            setIsTransitioning(false);
        };

        const track = trackRef.current;
        track.addEventListener('transitionend', handleTransitionEnd);
        return () => track.removeEventListener('transitionend', handleTransitionEnd);
    }, [currentIndex, loopedBlogs.length]);

    // This effect re-enables the transition *after* a jump has occurred
    useEffect(() => {
        if (trackRef.current && trackRef.current.style.transition === 'none') {
            // Use a minimal timeout to let the browser render the jump before re-enabling animations
            setTimeout(() => {
                if (trackRef.current) {
                    trackRef.current.style.transition = '';
                }
            }, 10); // A tiny delay is sufficient
        }
    }, [currentIndex]);

    // Handlers for navigation and autoplay
    const moveTo = useCallback((newIndex) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(newIndex);
    }, [isTransitioning]);

    const handleNext = useCallback(() => moveTo(currentIndex + 1), [currentIndex, moveTo]);
    const handlePrev = useCallback(() => moveTo(currentIndex - 1), [currentIndex, moveTo]);
    
    const stopAutoPlay = () => { if(intervalRef.current) clearInterval(intervalRef.current); };

    const startAutoPlay = useCallback(() => {
        stopAutoPlay();
        intervalRef.current = setInterval(handleNext, 5000);
    }, [handleNext]);

    const handleNextClick = () => { stopAutoPlay(); handleNext(); startAutoPlay(); };
    const handlePrevClick = () => { stopAutoPlay(); handlePrev(); startAutoPlay(); };

    useEffect(() => {
        if (blogs.length > 0) {
            startAutoPlay();
        }
        return stopAutoPlay;
    }, [blogs.length, startAutoPlay]);

    const cardWidthPercent = 100 / 3;
    const transformValue = -currentIndex * cardWidthPercent + cardWidthPercent;
    
    if (blogs.length === 0) { return <div>Loading Blogs...</div>; }

    return (
        <div className={`blog-page-wrapper ${isPageLoaded ? 'page-loaded' : ''}`}>
            <section className="blog-layout">
                
                <h2 className="section-title animate-on-load">FSSAI Food Safety Samvad Blog</h2>

                <div className="layout-main-content animate-on-scroll">
                    <div className="left-column-wrapper">
                        <div className="carousel-container">
                            <button className="nav-btn left-btn" onClick={handlePrevClick} disabled={isTransitioning}>‹</button>
                            <div className="carousel-track-wrapper">
                                <div className="carousel-track" ref={trackRef} style={{ transform: `translateX(${transformValue}%)` }}>
                                    {loopedBlogs.map((blog, index) => ( <div key={`${blog.id}-${index}`} className={`carousel-card ${index === currentIndex ? 'center-card' : 'side-card'}`} onMouseEnter={stopAutoPlay} onMouseLeave={startAutoPlay}> <BlogCard blog={blog} /> </div> ))}
                                </div>
                            </div>
                            <button className="nav-btn right-btn" onClick={handleNextClick} disabled={isTransitioning}>›</button>
                        </div>

                        <div className="all-articles-container animate-on-scroll">
                            <h3 className="all-articles-title">Explore All Articles</h3>
                            <ul className="all-articles-list">
                                {blogs.map((blog) => (
                                    <li key={blog.id}>
                                        <Link to={`/blog/${blog.id}`}>
                                            <span className="article-title-main">{blog.title}</span>
                                            <div className="article-meta-data">
                                                <span className="article-author">{blog.author_name || 'Anonymous'}</span>
                                                <span className="article-publish-date">{formatDate(blog.publish_date)}</span>
                                            </div>
                                            <span className="article-arrow">→</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <aside className="right-sidebar">
                        <div className="search-widget-container">
                            <h4>Search Articles</h4>
                            <div className="search-container">
                                <input type="text" placeholder="Search by Title or Author..." className="blog-search-box" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                <div className={`search-results ${searchQuery ? 'visible' : ''}`}>
                                    {filteredBlogs.length > 0 ? ( filteredBlogs.map(blog => ( <Link key={blog.id} to={`/blog/${blog.id}`} className="search-result-item"> {blog.title} </Link> )) ) : ( <p className="search-no-results">No blogs found.</p> )}
                                </div>
                            </div>
                        </div>
                        <div className="featured-articles-container animate-on-scroll">
                            <div className="featured-articles">
                                <h4>Featured Articles</h4>
                                <ul>
                                    {featuredArticles.length > 0 ? ( featuredArticles.map(blog => ( <li key={blog.id}> <Link to={`/blog/${blog.id}`}>{blog.title}</Link> </li> )) ) : ( <li>No featured articles available.</li> )}
                                </ul>
                            </div>
                        </div>

                        <div className="social-media-container animate-on-scroll">
                            <div className="social-media-links">
                                <h4>Follow Us</h4>
                                <div className="social-media-icons">
                                    <a href="https://www.youtube.com/user/FoodsafetyinIndia/" target="_blank" rel="noopener noreferrer" className="social-icon youtube"><FaYoutube /></a>
                                    <a href="https://www.instagram.com/fssai_safefood/" target="_blank" rel="noopener noreferrer" className="social-icon instagram"><FaInstagram /></a>
                                    <a href="https://www.linkedin.com/company/fssaiindia/posts/?feedView=all/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin"><FaLinkedin /></a>
                                    <a href="https://www.facebook.com/fssai/" target="_blank" rel="noopener noreferrer" className="social-icon facebook"><FaFacebookF /></a>
                                    <a href="https://x.com/fssaiindia/" target="_blank" rel="noopener noreferrer" className="social-icon twitter"><FaTwitter /></a>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
            
            <footer className="disclaimer-footer">
                <div className="disclaimer-content animate-on-scroll">
                    <h4>Disclaimer</h4>
                    <p> The views expressed in the blog belong solely to the author and do not necessarily reflect the views, opinions, policies or position of the Food Safety and Standards Authority of India</p>
                </div>

                <div className="footer-bottom-bar animate-on-scroll">
                    <p>© 2025 FSSAI - All Rights Reserved. Website Maintained by FSSAI</p>
                </div>
            </footer>
        </div>
    );
};

export default BlogLayout;

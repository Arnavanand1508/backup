// src/components/ShareSection.js

import React, { useState, useEffect, useRef } from 'react';
import './ShareSection.css';
import {
    FaShareAlt, FaWhatsapp, FaTwitter,
    FaFacebookF, FaTelegramPlane, FaEnvelope, FaLink
} from 'react-icons/fa';

const ShareSection = ({ blogTitle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copyText, setCopyText] = useState('Copy Link');
    const popoutRef = useRef(null);

    const shareUrl = window.location.href;
    const shareText = `Check out this article: ${blogTitle}`;

    const socialLinks = [
        { icon: <FaWhatsapp />, name: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
        { icon: <FaTwitter />, name: 'X', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
        { icon: <FaFacebookF />, name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
        { icon: <FaTelegramPlane />, name: 'Telegram', url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
        { icon: <FaEnvelope />, name: 'Mail', url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}` },
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy Link'), 2000); // Reset after 2 seconds
        });
    };

    // This effect handles closing the popout when you click outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoutRef.current && !popoutRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoutRef]);

    return (
        <div className="share-section-container" ref={popoutRef}>
            <button className="share-button" onClick={() => setIsOpen(!isOpen)}>
                <FaShareAlt />
                <span>Share</span>
            </button>

            <div className={`share-popout ${isOpen ? 'visible' : ''}`}>
                {socialLinks.map((social, index) => (
                    <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        // Staggered animation for each icon
                        style={{ transitionDelay: `${index * 0.05}s` }}
                    >
                        {social.icon}
                        <span>{social.name}</span>
                    </a>
                ))}
                <button
                    className="social-link copy-link-btn"
                    onClick={handleCopyLink}
                    style={{ transitionDelay: `${socialLinks.length * 0.05}s` }}
                >
                    <FaLink />
                    <span>{copyText}</span>
                </button>
            </div>
        </div>
    );
};

export default ShareSection;
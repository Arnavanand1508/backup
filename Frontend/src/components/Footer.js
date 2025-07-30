import React from 'react';
import './Footer.css';

/**
 * A reusable footer component for the entire site, styled to match the provided image.
 */
const Footer = () => {
    // Function to open the Gmail compose window when the email is clicked
    const handleEmailClick = () => {
        const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=iec@fssai.gov.in';
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <footer className="site-footer">
            {/* The moving text bar, now part of the footer */}
            <div className="moving-disclaimer">
                <p className="moving-text">
                    You can also contribute to FSSAI Food Safety Samvad Blog by sending it via email to <span onClick={handleEmailClick} className="footer-email-link">iec@fssai.gov.in</span>
                </p>
            </div>
            {/* The main blue section containing the disclaimer */}
            <div className="footer-disclaimer-section">
                <h4 className="footer-title">Disclaimer</h4>
                <p className="footer-disclaimer-text">
                    The views expressed in the Blog belong solely to the author and do not necessarily reflect the views, opinions, policies or position of the Food Safety and Standards Authority of India
                </p>
            </div>

            {/* The darker bottom bar with copyright information */}
            <div className="footer-bottom-bar">
                <p>© 2025 FSSAI - All Rights Reserved. Website Maintained by FSSAI</p>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useEffect, useRef } from 'react';
import './SocialMediaFeed.css';

const SocialMediaFeed = () => {
  const twitterContainer = useRef(null);

  useEffect(() => {
    // This function will handle loading the Twitter widget script
    const loadTwitterWidget = () => {
      // If the Twitter script object (twttr) is available,
      // tell it to find and render any new widgets on the page.
      if (window.twttr && window.twttr.widgets) {
        // Clear out the container first to avoid duplicate feeds
        if (twitterContainer.current) {
          twitterContainer.current.innerHTML = '';
        }

        // Use the official function to create the timeline inside our container
        window.twttr.widgets.createTimeline(
          {
            sourceType: 'profile',
            screenName: 'NASA' // <-- Yahan FSSAI ki jagah NASA kar diya hai
          },
          twitterContainer.current, // Target (woh div jahan feed dikhegi)
          {
            height: 500, // Height tumhare code se le li hai
            theme: 'light'
          }
        );
        return;
      }

      // If the script isn't loaded yet, create and add it to the page
      if (!document.getElementById('twitter-wjs')) {
        const script = document.createElement('script');
        script.id = 'twitter-wjs';
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        
        // When the script fully loads, run this logic again
        script.onload = loadTwitterWidget;

        document.body.appendChild(script);
      }
    };

    loadTwitterWidget();

  }, []);

  return (
    <div className="twitter-feed-widget">
      <h4>Follow Us on Twitter</h4>
      <div className="twitter-timeline-container" ref={twitterContainer}>
         {/* Jab tak feed load na ho, yeh text dikhega */}
         <p>Loading Tweets by @NASA...</p>
      </div>
    </div>
  );
};

export default SocialMediaFeed;